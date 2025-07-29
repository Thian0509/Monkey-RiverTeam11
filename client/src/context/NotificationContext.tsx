// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

// Define the shape of your notification item
interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Define the shape of the context value that consumers will receive
interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (message: string) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  // Initialize state from localStorage, or an empty array if nothing is found
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const storedNotifications = localStorage.getItem('app_notifications');
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error("Failed to parse notifications from localStorage", error);
      return []; // Return empty array on error
    }
  });

  // Effect to save notifications to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('app_notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error("Failed to save notifications to localStorage", error);
    }
  }, [notifications]); // Dependency array: run effect when 'notifications' state changes

  // Function to add a new notification
  const addNotification = useCallback((message: string) => {
    const newNotification: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      message: message,
      timestamp: new Date().toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    // Add to the top
    setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
  }, []);

  // Functions to remove, mark as read, mark all as read (remain unchanged, as they already update 'notifications' state)
  const removeNotification = useCallback((idToRemove: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== idToRemove)
    );
  }, []);

  const markAsRead = useCallback((idToMark: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === idToMark ? { ...notification, read: true } : notification
      )
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};