import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.unmock('../hooks/useAuth');
});

describe('<Layout /> when user is null', () => {
  it('renders login prompt', async () => {
    vi.doMock('../hooks/useAuth', () => ({
      useAuth: () => ({ user: null }),
    }));

    const { default: Layout } = await import('./Layout');
    render(
      <Layout>
        <div>Protected Content</div>
      </Layout>
    );

    expect(screen.getByText(/Please/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /log in/i })).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});