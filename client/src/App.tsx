import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './index.css'
import { AuthForm } from './components/AuthForm';
import Home from './pages/Home';
        
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import Notifications from './pages/Notifications';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/" element={<Home />} />
          <Route path="/notifications" element={<Notifications />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;