import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pokedex from './pages/Pokedex';
import Team from './pages/Team';
import PokemonDetails from './pages/PokemonDetails';
import Settings from './pages/Settings';
import WhosThatPokemon from './pages/WhosThatPokemon';
import NotFound from './pages/NotFound';

import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

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
              <Route path="pokemon/:id" element={<PokemonDetails />} />
              <Route path="team" element={<Team />} />
              <Route path="settings" element={<Settings />} />
              <Route path="akinator" element={<WhosThatPokemon />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
