import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Layout from "./Layout";

import Home from './pages/Home';
import TravelRisk from './pages/TravelRisk';
import Notifications from './pages/Notifications';
import ProfileSettings from './pages/ProfileSettings';

import { AuthForm } from './components/AuthForm';

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';


function App() {
  const noLayoutRoutes = ['/login', '/register']

  const isLayoutVisible = !noLayoutRoutes.includes(location.pathname)

  return (
    <BrowserRouter>
      {isLayoutVisible ? (
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/travelrisk" element={<TravelRisk />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/account" element={<ProfileSettings />} />
          </Routes>
        </Layout>
      ) : (
        <Routes>
          <Route path="/login" element={<AuthForm />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;