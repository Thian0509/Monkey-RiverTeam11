import { render } from '@testing-library/react';
import { describe, it } from 'vitest';
import Authenticate from './Authenticate';

describe('<Authenticate />', () => {
  it('renders without crashing', () => {
    expect(() => render(<Authenticate />)).toThrow(
      'useNotifications must be used within a NotificationProvider'
    );
  });
});
