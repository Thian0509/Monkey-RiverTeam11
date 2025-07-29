import React from 'react';
import { render } from '@testing-library/react';
import Loading from './Loading';

describe('Loading Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the spinner icon with correct classes', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('i');
    
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('pi', 'pi-spinner', 'animate-spin');
    expect(spinner).toHaveClass('text-gray-500');
  });

  it('has correct container styling for full screen overlay', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.firstChild;
    
    expect(loadingContainer).toHaveClass(
      'fixed',
      'top-0',
      'left-0',
      'flex',
      'justify-center',
      'items-center',
      'h-screen',
      'w-screen',
      'z-50'
    );
  });

  it('applies the correct text size styling', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('i');
    
    // Check for the !text-4xl class (the ! indicates important in Tailwind)
    expect(spinner?.className).toMatch(/text-4xl/);
  });

  it('has spinner animation class', () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector('i');
    
    expect(spinner).toHaveClass('animate-spin');
  });

  it('creates a full-screen loading overlay', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.firstChild;
    
    // Test that it's positioned as a full-screen overlay
    expect(loadingContainer).toHaveClass('fixed', 'top-0', 'left-0');
    expect(loadingContainer).toHaveClass('h-screen', 'w-screen');
    expect(loadingContainer).toHaveClass('z-50'); // High z-index for overlay
  });

  it('centers the spinner content', () => {
    const { container } = render(<Loading />);
    const loadingContainer = container.firstChild;
    
    expect(loadingContainer).toHaveClass('flex', 'justify-center', 'items-center');
  });

  it('matches snapshot', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toMatchSnapshot();
  });
});