import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';

import Layout from "./Layout";

import Home from './pages/Home';
import TravelRisk from './pages/TravelRisk';
import Notifications from './pages/Notifications';
import ProfileSettings from './pages/Account';
import Authenticate from './pages/Authenticate';
import About from './pages/About';

// IMPORT THE AUTH PROVIDER
import { AuthProvider } from './AuthProvider'; // Make sure this path is correct

// IMPORT THE BACKEND-DRIVEN NOTIFICATION PROVIDER
// This import must point to the file you renamed to useNotification.tsx
import { NotificationProvider } from './hooks/useNotification'; 

import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

function App() {
  const CurrentLocation = () => {
    const location = useLocation();
    const noLayoutRoutes = ['/authenticate'];
    const isLayoutVisible = !noLayoutRoutes.includes(location.pathname);

    return (
      <>
        {isLayoutVisible ? (
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/travelrisk" element={<TravelRisk />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/account" element={<ProfileSettings />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </Layout>
        ) : (
          <Routes>
            <Route path="/authenticate" element={<Authenticate />} />
          </Routes>
        )}
      </>
    );
  };


  return (
    // STEP 1: Wrap your entire application with AuthProvider first.
    // The NotificationProvider (backend-driven) uses the authentication token,
    // so AuthProvider must be higher in the component tree.
    <AuthProvider>
      {/* STEP 2: Wrap with the backend-driven NotificationProvider */}
      <NotificationProvider>
        <BrowserRouter>
          <CurrentLocation />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;