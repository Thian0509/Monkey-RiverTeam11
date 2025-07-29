import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import NavBar from './NavBar';

describe('NavBar Component', () => {
  it('renders without crashing', () => {
    render(<NavBar />);
  });

  it('displays the app title', () => {
    render(<NavBar />);
    expect(screen.getByText('M&R Travel Risk Assessment Tool')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<NavBar />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Travel Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Notifications')).toBeInTheDocument();
    expect(screen.getByText('Account')).toBeInTheDocument();
  });

  it('has correct links for all navigation items', () => {
    render(<NavBar />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    const travelRiskLink = screen.getByRole('link', { name: /travel risk assessment/i });
    const notificationsLink = screen.getByRole('link', { name: /notifications/i });
    const accountLink = screen.getByRole('link', { name: /account/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(travelRiskLink).toHaveAttribute('href', '/travelrisk');
    expect(notificationsLink).toHaveAttribute('href', '/notifications');
    expect(accountLink).toHaveAttribute('href', '/account');
  });

  it('renders all navigation icons', () => {
    const { container } = render(<NavBar />);
    
    const homeIcon = container.querySelector('.pi-home');
    const travelRiskIcon = container.querySelector('.pi-exclamation-triangle');
    const notificationsIcon = container.querySelector('.pi-bell');
    const accountIcon = container.querySelector('.pi-user');

    expect(homeIcon).toBeInTheDocument();
    expect(travelRiskIcon).toBeInTheDocument();
    expect(notificationsIcon).toBeInTheDocument();
    expect(accountIcon).toBeInTheDocument();
  });

  it('has proper navigation structure classes', () => {
    const { container } = render(<NavBar />);
    const nav = container.querySelector('nav');
    
    expect(nav).toHaveClass('p-4', 'sticky', 'top-0', 'w-full', 'shadow-md', 'z-40');
  });

  it('has proper flex layout classes', () => {
    const { container } = render(<NavBar />);
    const flexContainer = container.querySelector('.flex.justify-between.items-center');
    const navItemsContainer = container.querySelector('.flex.gap-2.items-center.text-sm');
    
    expect(flexContainer).toBeInTheDocument();
    expect(navItemsContainer).toBeInTheDocument();
  });

  it('has hover styling for navigation links', () => {
    const { container } = render(<NavBar />);
    const links = container.querySelectorAll('a');
    
    links.forEach(link => {
      expect(link).toHaveClass('hover:bg-gray-100', 'transition-colors', 'duration-200');
    });
  });

  it('renders navigation links with proper spacing and styling', () => {
    const { container } = render(<NavBar />);
    const links = container.querySelectorAll('a');
    
    links.forEach(link => {
      expect(link).toHaveClass('flex', 'items-center', 'gap-1.5', 'p-1', 'px-2', 'rounded');
    });
  });

  it('has the correct number of navigation items', () => {
    render(<NavBar />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(5);
  });

  it('maintains proper semantic structure with nav element', () => {
    render(<NavBar />);
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});