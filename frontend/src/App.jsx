import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pokedex from './pages/Pokedex';
import Team from './pages/Team';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Placeholder pages for now
const Placeholder = ({ title }) => <div className="p-10 text-white text-3xl font-display">{title} (Coming Soon)</div>

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="pokedex" element={<Pokedex />} />
              <Route path="team" element={<Team />} />
              <Route path="*" element={<Placeholder title="404 Not Found" />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
