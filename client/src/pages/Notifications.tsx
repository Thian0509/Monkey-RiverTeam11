// src/components/Notifications.tsx
import React, { useState } from 'react';
import { Button } from 'primereact/button';

interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-001',
      message: 'Your order #1234 has been shipped!',
      timestamp: '5 minutes ago',
      read: false,
    },
    {
      id: 'notif-002',
      message: 'New message from support regarding your query.',
      timestamp: '1 hour ago',
      read: false,
    },
    {
      id: 'notif-003',
      message: 'Your payment was successfully processed.',
      timestamp: 'Yesterday',
      read: true,
    },
    {
      id: 'notif-004',
      message: 'Promotion: Get 20% off all premium items this week!',
      timestamp: '2 days ago',
      read: true,
    },
    {
      id: 'notif-005',
      message: 'Reminder: Your subscription renews in 3 days.',
      timestamp: 'Last Monday',
      read: false,
    },
  ]);

  const removeNotification = (idToRemove: string) => {
    // Filter out the notification with the given ID
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== idToRemove)
    );
  };

  return (
    <div className="flex justify-center p-4 w-screen h-screen">
      {notifications.length > 0 ? ( // Check 'notifications' state
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="p-3 mb-2 border-round flex align-items-center" // Added flex for button alignment
              style={{
                backgroundColor: notification.read ? '#f0f0f0' : '#e0f7fa',
                borderLeft: notification.read ? 'none' : '5px solid #007ad9'
              }}
            >
              <div className="flex-grow-1"> {/* This div takes up available space */}
                <p className="m-0" style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                  {notification.message}
                </p>
                <small style={{ color: '#666' }}>{notification.timestamp}</small>
              </div>
              <Button
                icon="pi pi-times"
                onClick={() => removeNotification(notification.id)}
                aria-label={`Remove notification: ${notification.message}`}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-500">No new notifications.</p>
      )}
    </div>
  );
};

export default Notifications;