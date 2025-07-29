import { useState } from 'react';
import './App.css'; // Keep your existing global CSS if any

// React Router
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
        
import 'primereact/resources/themes/saga-blue/theme.css'; // or your preferred theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { AuthForm } from './components/AuthForm';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginForm onLoginSubmit={handleLoginSubmit} onNavigateToRegister={() => setShowRegister(true)} />} />
          <Route path="/register" element={<RegisterForm onRegisterSubmit={handleRegisterSubmit} onNavigateToLogin={() => setShowRegister(false)} />} />
          <Route path="/" element={<Home />} />
            {/* {showRegister ? (
              <RegisterForm onRegisterSubmit={handleRegisterSubmit} onNavigateToLogin={() => setShowRegister(false)} />
            ) : (
              <LoginForm onLoginSubmit={handleLoginSubmit} onNavigateToRegister={() => setShowRegister(true)} />
            )} */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;