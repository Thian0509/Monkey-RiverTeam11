import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';

describe('About', () => {
  it('renders the component without crashing', () => {
    render(<About />);
    expect(screen.getByText('About Team 11')).toBeInTheDocument();
  });

  it('displays copyright information with current year', () => {
    render(<About />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear} Team 11`))).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('has accessible structure with proper heading hierarchy', () => {
    render(<About />);
    
    const h1 = screen.getByRole('heading', { level: 1 });
    const h2 = screen.getByRole('heading', { level: 2 });
    
    expect(h1).toBeInTheDocument();
    expect(h2).toBeInTheDocument();
    expect(h1).toHaveTextContent('About Team 11');
    expect(h2).toHaveTextContent('Contact Us');
  });

  it('has proper link accessibility', () => {
    render(<About />);
    const emailLink = screen.getByRole('link', { name: /support@team11\.com/ });
    
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', 'mailto:support@team11.com');
  });
});
