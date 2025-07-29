import React from 'react';
import { Button } from 'primereact/button';
import { useNotifications } from '../context/NotificationContext'; // Import your custom hook

export const Notifications: React.FC = () => {
  // Use the custom hook to get notifications and the functions to manipulate them
  const { notifications, removeNotification, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="flex justify-center p-4 w-screen h-screen">
      <div style={{ maxWidth: '500px', width: '100%' }}> {/* Added a container for better layout */}
        <h2 className="text-center">Notifications</h2>
        {/* Example: Buttons to mark notifications */}
        <div className="flex justify-content-end mb-3 gap-2"> {/* Added gap for spacing */}
            <Button
                label="Mark All Read"
                icon="pi pi-check-circle"
                onClick={markAllAsRead}
                className="p-button-sm p-button-outlined"
                disabled={notifications.every(n => n.read)} // Disable if all are already read
            />
        </div>

        {notifications.length > 0 ? (
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="p-3 mb-2 border-round flex align-items-center"
                style={{
                  backgroundColor: notification.read ? '#f0f0f0' : '#e0f7fa',
                  borderLeft: notification.read ? 'none' : '5px solid #007ad9',
                  display: 'flex', // Ensure flex for proper alignment of text and button
                  alignItems: 'center',
                  justifyContent: 'space-between' // Distribute space between content and button
                }}
                onClick={() => !notification.read && markAsRead(notification.id)} // Mark as read on click if not already read
              >
                <div style={{ flexGrow: 1, cursor: notification.read ? 'default' : 'pointer' }}> {/* This div takes up available space */}
                  <p className="m-0" style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                    {notification.message}
                  </p>
                  <small style={{ color: '#666' }}>{notification.timestamp}</small>
                </div>
                <Button
                  icon="pi pi-times"
                  className="p-button-rounded p-button-text p-button-sm" // Smaller, text-only button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent li's onClick from firing
                    removeNotification(notification.id);
                  }}
                  aria-label={`Remove notification: ${notification.message}`}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-500">No new notifications.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;