import axios from 'axios';
import { setupAxiosInterceptors as setupInterceptors } from './axiosConfig';

// Función para obtener el token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Función para configurar el token en las peticiones
export const setupAxiosInterceptors = () => {
  const token = getToken();
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Función para verificar si el usuario está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Función para obtener la información del usuario
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Función para cerrar sesión
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  delete axios.defaults.headers.common['Authorization'];
}; 