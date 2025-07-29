import { useState } from 'react';
import './App.css'; // Keep your existing global CSS if any

// React Router
import { Routes, Route, BrowserRouter } from 'react-router-dom';


// Import your new components
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Home from './pages/Home';

function App() {
  const [showRegister, setShowRegister] = useState(false);

  // These functions would typically be where a backend call would happen
  const handleLoginSubmit = (email: string, password: string) => {
    console.log('Frontend Login Form Submitted (to be integrated with backend):', { email, password });
    // In a real app, you'd send this to your backend/Clerk API
    alert('Login form submitted! Check console for data.');
  };

  const handleRegisterSubmit = (email: string, password: string, confirmPassword: string) => {
    console.log('Frontend Register Form Submitted (to be integrated with backend):', { email, password, confirmPassword });
    // In a real app, you'd send this to your backend/Clerk API
    alert('Register form submitted! Check console for data.');
  };

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