// src/components/Notifications.tsx
import React, { useState } from 'react'; // Import useState
import { Card } from 'primereact/card';
import { Button } from 'primereact/button'; // Import Button for the close icon

interface NotificationItem {
  id: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export const Notifications: React.FC = () => {
  // --- UPDATED: Use useState for notifications ---
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
  // --- END UPDATED ---

  // --- NEW: Function to remove a notification ---
  const removeNotification = (idToRemove: string) => {
    // Filter out the notification with the given ID
    setNotifications(prevNotifications =>
      prevNotifications.filter(notification => notification.id !== idToRemove)
    );
  };
  // --- END NEW ---

  const header = (
    <h2 className="text-center">Your Notifications</h2>
  );

  return (
    <div className="flex justify-content-center align-items-center min-h-screen p-4">
      <Card title={header} className="w-full max-w-md">
        <div className="p-fluid">
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
                  {/* --- NEW: Add a remove button/icon --- */}
                  <Button
                    icon="pi pi-times" // PrimeIcons 'times' for an 'X'
                    className="p-button-rounded p-button-text p-button-sm ml-2" // Smaller, text-only button
                    onClick={() => removeNotification(notification.id)} // Call removal function on click
                    aria-label={`Remove notification: ${notification.message}`}
                  />
                  {/* --- END NEW --- */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-500">No new notifications.</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Notifications;