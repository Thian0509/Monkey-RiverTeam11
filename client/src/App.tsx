// src/App.tsx
import React from 'react';
import './App.css'; // Keep your existing global CSS if any

// --- PrimeReact CSS Imports ---
// You need to import these styles for PrimeReact components to look correct.
// Make sure you have primeflex installed: npm install primeflex
import 'primereact/resources/themes/saga-blue/theme.css'; // or your preferred theme
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

// Import your new, self-contained AuthForm component
import { AuthForm } from './components/AuthForm';

function App() {
  return (
    <div className="App">
      {/* The AuthForm component now handles everything:
        - Toggling between login and register
        - Form state and validation
        - Submission logic
      */}
      <AuthForm />
    </div>
  );
}

export default App;