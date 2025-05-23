import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import RegisterPage from './modules/auth/pages/RegisterPage';
import LoginPage from './modules/auth/pages/LoginPage';
import FormPage from './modules/predictions/pages/FormPage'; // Importar el componente para registrar alumnos
import HistoryPage from './modules/predictions/pages/HistoryPage';
import { AppBar, Button, Link, Toolbar, Typography } from '@mui/material';
import { setupAxiosInterceptors, isAuthenticated, logout } from './utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRegister = () => {
    navigate('/form');
  };

  const handleHistory = () => {
    navigate('/historial');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Frank Chupa Pinga APP
        </Typography>
        <Button color="inherit" onClick={handleRegister}>
          Registrar
        </Button>
        <Button color="inherit" onClick={handleHistory}>
          Historial
        </Button>
        <Button color="inherit" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
};

// Componente para proteger rutas
const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  return children;
};

const App = () => {
  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/form"
          element={
            <ProtectedRoute>
              <FormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
