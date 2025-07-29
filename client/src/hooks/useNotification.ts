import { createContext, useContext } from "react";

export interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NotificationContextType {
  notifications: NotificationItem[];
  addNotification: (message: string) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};