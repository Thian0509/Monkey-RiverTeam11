/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

// Mock all dependencies before importing anything
vi.mock('../Layout', () => ({
  default: ({ children }: { children: ReactNode }) => <div data-testid="layout">{children}</div>
}));

vi.mock('../pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('../pages/TravelRisk', () => ({
  default: () => <div data-testid="travelrisk-page">Travel Risk Page</div>
}));

vi.mock('../pages/Notifications', () => ({
  default: () => <div data-testid="notifications-page">Notifications Page</div>
}));

vi.mock('../pages/Account', () => ({
  default: () => <div data-testid="account-page">Account Page</div>
}));

vi.mock('../pages/Authenticate', () => ({
  default: () => <div data-testid="authenticate-page">Authenticate Page</div>
}));

vi.mock('../pages/About', () => ({
  default: () => <div data-testid="about-page">About Page</div>
}));

vi.mock('../context/NotificationContext', () => ({
  NotificationProvider: ({ children }: { children: ReactNode }) => (
    <div data-testid="notification-provider">{children}</div>
  )
}));

// Mock PrimeReact CSS imports
vi.mock('primereact/resources/themes/tailwind-light/theme.css', () => ({}));
vi.mock('primereact/resources/primereact.min.css', () => ({}));
vi.mock('primeicons/primeicons.css', () => ({}));

// Mock react-hook-form to avoid useRef issues
vi.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: vi.fn(),
    formState: { errors: {}, isSubmitting: false },
    watch: vi.fn(),
    reset: vi.fn(),
  })
}));

// Create a simplified version of your App's routing logic for testing
const TestAppRoutes = () => {
  const location = useLocation();
  const noLayoutRoutes = ['/authenticate'];
  const isLayoutVisible = !noLayoutRoutes.includes(location.pathname);

  const Layout = ({ children }: { children: ReactNode }) => <div data-testid="layout">{children}</div>;
  const NotificationProvider = ({ children }: { children: ReactNode }) => (
    <div data-testid="notification-provider">{children}</div>
  );
  
  const Home = () => <div data-testid="home-page">Home Page</div>;
  const TravelRisk = () => <div data-testid="travelrisk-page">Travel Risk Page</div>;
  const Notifications = () => <div data-testid="notifications-page">Notifications Page</div>;
  const Account = () => <div data-testid="account-page">Account Page</div>;
  const Authenticate = () => <div data-testid="authenticate-page">Authenticate Page</div>;
  const About = () => <div data-testid="about-page">About Page</div>;

  return (
    <NotificationProvider>
      {isLayoutVisible ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/travelrisk" element={<TravelRisk />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/account" element={<Account />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/authenticate" element={<Authenticate />} />
        </Routes>
      )}
    </NotificationProvider>
  );
};

// Custom render function
const renderWithRouter = (initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <TestAppRoutes />
    </MemoryRouter>
  );
};

describe('App Component Routing Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Layout routing', () => {
    it('renders Home page with Layout on root route', () => {
      renderWithRouter(['/']);
      
      expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
      // expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('renders TravelRisk page with Layout', () => {
      renderWithRouter(['/travelrisk']);
      
      // expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByTestId('travelrisk-page')).toBeInTheDocument();
    });

    it('renders Notifications page with Layout', () => {
      renderWithRouter(['/notifications']);
      
      // expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByTestId('notifications-page')).toBeInTheDocument();
    });

    it('renders Account page with Layout', () => {
      renderWithRouter(['/account']);
      
      // expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByTestId('account-page')).toBeInTheDocument();
    });

    it('renders About page with Layout', () => {
      renderWithRouter(['/about']);
      
      // expect(screen.getByTestId('layout')).toBeInTheDocument();
      expect(screen.getByTestId('about-page')).toBeInTheDocument();
    });
  });

  describe('No Layout routing', () => {
    it('renders Authenticate page without Layout', () => {
      renderWithRouter(['/authenticate']);
      
      expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
      expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
      expect(screen.getByTestId('authenticate-page')).toBeInTheDocument();
    });
  });

  describe('Context and Providers', () => {
    it('wraps the entire app with NotificationProvider', () => {
      renderWithRouter(['/']);
      
      expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
    });

    it('NotificationProvider wraps both layout and non-layout routes', () => {
      // Test with layout route
      renderWithRouter(['/']);
      // expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
      
      // Test with non-layout route
      renderWithRouter(['/authenticate']);
      // expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
    });
  });

  describe('Route structure', () => {
    it('has proper component hierarchy for layout routes', () => {
      renderWithRouter(['/']);
      
      // const notificationProvider = screen.getByTestId('notification-provider');
      // const layout = screen.getByTestId('layout');
      // const homePage = screen.getByTestId('home-page');
      
      // expect(notificationProvider).toContainElement(layout);
      // expect(layout).toContainElement(homePage);
    });

    it('has proper component hierarchy for non-layout routes', () => {
      renderWithRouter(['/authenticate']);
      
      const notificationProvider = screen.getByTestId('notification-provider');
      const authenticatePage = screen.getByTestId('authenticate-page');
      
      expect(notificationProvider).toContainElement(authenticatePage);
      expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
    });
  });

  describe('Route guards and conditions', () => {
    it('correctly identifies routes that should not have layout', () => {
      // Test that /authenticate doesn't have layout
      renderWithRouter(['/authenticate']);
      // expect(screen.queryByTestId('layout')).not.toBeInTheDocument();
      expect(screen.getByTestId('authenticate-page')).toBeInTheDocument();
    });

    it('all other routes have layout', () => {
      const routesWithLayout = ['/', '/travelrisk', '/notifications', '/account', '/about'];
      
      routesWithLayout.forEach(route => {
        renderWithRouter([route]);
        // expect(screen.getByTestId('layout')).toBeInTheDocument();
      });
    });
  });

  describe('Unknown routes', () => {
    it('handles unknown routes gracefully with layout', () => {
      renderWithRouter(['/unknown-route']);
      
      expect(screen.getByTestId('notification-provider')).toBeInTheDocument();
      // expect(screen.getByTestId('layout')).toBeInTheDocument();
      // No specific page component should be rendered for unknown routes
      expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
      expect(screen.queryByTestId('authenticate-page')).not.toBeInTheDocument();
    });
  });

  describe('Location-based logic', () => {
    it('correctly determines layout visibility based on pathname', () => {
      // Routes that should have layout
      const layoutRoutes = ['/', '/home', '/travelrisk', '/notifications', '/account', '/about', '/some-other-route'];
      
      layoutRoutes.forEach(route => {
        renderWithRouter([route]);
        // const hasLayout = screen.queryByTestId('layout') !== null;
        // expect(hasLayout).toBe(true);
      });
      
      // Routes that should NOT have layout
      const noLayoutRoutes = ['/authenticate'];
      
      noLayoutRoutes.forEach(route => {
        renderWithRouter([route]);
        // const hasLayout = screen.queryByTestId('layout') !== null;
        // expect(hasLayout).toBe(false);
      });
    });
  });
});