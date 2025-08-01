import { Button } from 'primereact/button';
import { useNotifications } from '../hooks/useNotification';

export default function Notifications() {
  const { notifications, removeNotification, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="flex justify-center p-4 w-screen h-screen">
      <div className="w-">
        {notifications.length > 0 ? (
          <>
            <div className="flex justify-content-end mb-3 gap-2">
                <Button
                    label="Mark All Read"
                    icon="pi pi-check-circle"
                    onClick={markAllAsRead}
                    className="p-button-sm p-button-outlined"
                    disabled={notifications.every(n => n.read)}
                />
            </div>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="p-3 mb-2 border-round flex align-items-center"
                  style={{
                    backgroundColor: notification.read ? '#f0f0f0' : '#e0f7fa',
                    borderLeft: notification.read ? 'none' : '5px solid #007ad9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div style={{ flexGrow: 1, cursor: notification.read ? 'default' : 'pointer' }}>
                    <p className="m-0" style={{ fontWeight: notification.read ? 'normal' : 'bold' }}>
                      {notification.message}
                    </p>
                    <small style={{ color: '#666' }}>{notification.timestamp}</small>
                  </div>
                  <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-text p-button-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notification.id);
                    }}
                    aria-label={`Remove notification: ${notification.message}`}
                  />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-center text-500 mt-4">No new notifications. Enjoy your day :)</p>
        )}
      </div>
    </div>
  );
};