import React, { useState } from 'react';
import './App.css'; // Keep your existing global CSS if any

// Import your new components
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

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
      {/* PrimeFlex for utility classes like flex, justify-content-center, align-items-center, md:w-25rem */}
      {/* Make sure you have PrimeFlex installed if these classes don't work (npm i primeflex) */}
      {/* If you don't have PrimeFlex, these classes won't apply, but the forms will still render */}

      {showRegister ? (
        <RegisterForm
          onRegisterSubmit={handleRegisterSubmit}
          onNavigateToLogin={() => setShowRegister(false)}
        />
      ) : (
        <LoginForm
          onLoginSubmit={handleLoginSubmit}
          onNavigateToRegister={() => setShowRegister(true)}
        />
      )}
    </div>
  );
}

export default App;