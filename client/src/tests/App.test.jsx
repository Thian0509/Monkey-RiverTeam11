import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders App component', () => {
  render(<App />);
  expect(screen.getByRole('generic', { hidden: true }) || screen.getByTestId('app-root')).toBeInTheDocument();
});
