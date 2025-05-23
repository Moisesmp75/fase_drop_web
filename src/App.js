import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import RegisterPage from './modules/auth/pages/RegisterPage';
import LoginPage from './modules/auth/pages/LoginPage';
import FormPage from './modules/predictions/pages/FormPage'; // Importar el componente para registrar alumnos
import HistoryPage from './modules/predictions/pages/HistoryPage';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import AlumnosPage from './modules/alumnos/pages/AlumnosPage';
import { AppBar, Button, Link, Toolbar, Typography } from '@mui/material';
import { setupAxiosInterceptors, isAuthenticated, logout } from './utils/auth';
import { LoadingProvider, useLoading } from './utils/LoadingContext';
import { setupAxiosInterceptors as setupAxiosLoading } from './utils/axiosConfig';

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

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  const handleAlumnos = () => {
    navigate('/alumnos');
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
          Predicción Escolar
        </Typography>
        <Button color="inherit" onClick={handleDashboard}>
          Dashboard
        </Button>
        <Button color="inherit" onClick={handleAlumnos}>
          Alumnos
        </Button>
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

const AppContent = () => {
  const { setLoading } = useLoading();

  useEffect(() => {
    setupAxiosInterceptors();
    setupAxiosLoading(setLoading);
  }, [setLoading]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/alumnos"
          element={
            <ProtectedRoute>
              <AlumnosPage />
            </ProtectedRoute>
          }
        />
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

const App = () => {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  );
};

export default App;
