import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import { AuthForm } from './components/AuthForm';
import Home from './pages/Home';
        
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;