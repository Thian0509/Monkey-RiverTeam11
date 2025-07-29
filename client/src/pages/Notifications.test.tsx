import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Notifications from './Notifications';

const mockNotifications = [
  {
    id: '1',
    message: 'Test Notification 1',
    timestamp: '2025-07-29 10:00',
    read: false,
  },
  {
    id: '2',
    message: 'Test Notification 2',
    timestamp: '2025-07-29 11:00',
    read: true,
  },
];

const removeNotification = vi.fn();
const markAsRead = vi.fn();
const markAllAsRead = vi.fn();

vi.mock('../hooks/useNotification', () => ({
  useNotifications: () => ({
    notifications: mockNotifications,
    removeNotification,
    markAsRead,
    markAllAsRead,
  }),
}));

describe('<Notifications />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the list of notifications', () => {
    render(<Notifications />);
    expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Test Notification 2')).toBeInTheDocument();
  });

  it('marks a notification as read when clicked', () => {
    render(<Notifications />);
    const unreadItem = screen.getByText('Test Notification 1');
    fireEvent.click(unreadItem);
    expect(markAsRead).toHaveBeenCalledWith('1');
  });

  it('does not mark a notification as read if it is already read', () => {
    render(<Notifications />);
    const readItem = screen.getByText('Test Notification 2');
    fireEvent.click(readItem);
    expect(markAsRead).not.toHaveBeenCalledWith('2');
  });

  it('removes a notification when the remove button is clicked', () => {
    render(<Notifications />);
    const closeButtons = screen.getAllByRole('button', { name: /remove notification/i });
    fireEvent.click(closeButtons[0]);
    expect(removeNotification).toHaveBeenCalledWith('1');
  });

  it('marks all notifications as read when clicking "Mark All Read"', () => {
    render(<Notifications />);
    const markAllBtn = screen.getByRole('button', { name: /mark all read/i });
    fireEvent.click(markAllBtn);
    expect(markAllAsRead).toHaveBeenCalled();
  });
});
