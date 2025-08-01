import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { useAuth } from './useAuth'; // Your existing auth hook

// Define the interface for the notification item
export interface NotificationItem {
  id: string; // Mapped from MongoDB's _id
  message: string;
  timestamp: string; // ISO string from Date object
  read: boolean;
  type?: 'info' | 'warning' | 'danger'; // Matches your Alert model's enum
}

// Define the context type for functions to interact with notifications
export interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (message: string, type?: 'info' | 'warning' | 'danger') => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification Provider Component
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth(); // Get token for authenticated requests

  const API_BASE_URL = 'http://localhost:5050/api/alerts'; // Matches your alertRoutes.ts

  // Function to fetch notifications from the backend
  const fetchNotifications = useCallback(async () => {
    if (!token) {
      setError('Not authenticated. Please log in.');
      setLoading(false);
      setNotifications([]); // Clear notifications if not authenticated
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<NotificationItem[]>(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedNotifications = response.data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setNotifications(sortedNotifications);
    } catch (err: any) {
      console.error("Error fetching notifications (alerts):", err);
      setError(err.response?.data?.message || 'Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Initial fetch when component mounts or token changes
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const addNotification = useCallback(async (message: string, type: 'info' | 'warning' | 'danger' = 'info') => {
    if (!token) {
      setError('Not authenticated.');
      throw new Error('Not authenticated.');
    }
    try {
      const response = await axios.post<NotificationItem>(API_BASE_URL, { message, type }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => [response.data, ...prev].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    } catch (err: any) {
      console.error("Error adding notification (alert):", err);
      setError(err.response?.data?.message || 'Failed to add notification.');
      throw err;
    }
  }, [token]);

  const removeNotification = useCallback(async (id: string) => {
    if (!token) {
      setError('Not authenticated.');
      throw new Error('Not authenticated.');
    }
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err: any) {
      console.error("Error removing notification (alert):", err);
      setError(err.response?.data?.message || 'Failed to remove notification.');
      throw err;
    }
  }, [token]);

  const markAsRead = useCallback(async (id: string) => {
    if (!token) {
      setError('Not authenticated.');
      throw new Error('Not authenticated.');
    }
    try {
      const response = await axios.put<NotificationItem>(`${API_BASE_URL}/mark-read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(prev => prev.map(n => n.id === id ? response.data : n));
    } catch (err: any) {
      console.error("Error marking notification (alert) as read:", err);
      setError(err.response?.data?.message || 'Failed to mark notification as read.');
      throw err;
    }
  }, [token]);

  const markAllAsRead = useCallback(async () => {
    if (!token) {
      setError('Not authenticated.');
      throw new Error('Not authenticated.');
    }
    try {
      const response = await axios.put<NotificationItem[]>(`${API_BASE_URL}/mark-all-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedNotifications = response.data.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setNotifications(sortedNotifications);
    } catch (err: any) {
      console.error("Error marking all notifications (alerts) as read:", err);
      setError(err.response?.data?.message || 'Failed to mark all notifications as read.');
      throw err;
    }
  }, [token]);

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    loading,
    error,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook to consume the context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};