import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';

import Layout from "./Layout";

import Home from './pages/Home';
import TravelRisk from './pages/TravelRisk';
import Notifications from './pages/Notifications';
import ProfileSettings from './pages/Account';
import Authenticate from './pages/Authenticate';
import About from './pages/About';

import { NotificationProvider } from './context/NotificationContext';

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
    <NotificationProvider>
      <BrowserRouter>
        <CurrentLocation />
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;