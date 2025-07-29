import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom'; // Import useLocation

import Layout from "./Layout";

import Home from './pages/Home';
import TravelRisk from './pages/TravelRisk';
import Notifications from './pages/Notifications';
import ProfileSettings from './pages/Account';
import Authenticate from './pages/Authenticate';
import About from './pages/About';

// Import the NotificationProvider from your context file
import { NotificationProvider } from './context/NotificationContext';

import 'primereact/resources/themes/tailwind-light/theme.css';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css'; // Don't forget primeicons for the icons!


function App() {
  // Use useLocation hook to get the current path dynamically within the BrowserRouter context
  // This replaces the global 'location.pathname' which might not update reactively within BrowserRouter
  const CurrentLocation = () => {
    const location = useLocation();
    const noLayoutRoutes = ['/authenticate'];
    const isLayoutVisible = !noLayoutRoutes.includes(location.pathname);

    return (
      <> {/* Use a fragment to return multiple elements */}
        {isLayoutVisible ? (
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/travelrisk" element={<TravelRisk />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/account" element={<ProfileSettings />} />
              <Route path="/about" element={<About />} />
              {/* Add other routes that should have the layout here */}
            </Routes>
          </Layout>
        ) : (
          <Routes>
            {/* The Authenticate route should NOT have the common layout */}
            <Route path="/authenticate" element={<Authenticate />} />
          </Routes>
        )}
      </>
    );
  };


  return (
    // 1. Wrap your entire application (starting from BrowserRouter) with NotificationProvider
    <NotificationProvider>
      <BrowserRouter>
        {/* 2. Render CurrentLocation component inside BrowserRouter */}
        <CurrentLocation />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;