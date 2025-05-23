import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Box, Paper, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Para redirigir al login
import config from '../../../config';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el correo termine en @gmail.com
    if (!formData.email.endsWith('@gmail.com')) {
      setMessage('El correo electrónico debe ser de dominio @gmail.com');
      return;
    }

    try {
      const response = await axios.post(`${config.API_URL}/api/register`, formData);
      setMessage(response.data.message);
      setMessage('Registro exitoso');
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      setMessage('Error al registrar el usuario');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper elevation={6} sx={{ padding: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Crear Cuenta
          </Typography>

          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            Regístrate para acceder
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              name="nombre"
              label="Nombre"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              name="email"
              label="Correo Electrónico"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <TextField
              name="password"
              label="Contraseña"
              type="password"
              fullWidth
              margin="normal"
              onChange={handleChange}
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, py: 1.5 }}
            >
              Registrar
            </Button>
          </form>

          {message && (
            <Typography
              variant="body1"
              color={message.includes("Error") ? "error" : "success"}
              sx={{ marginTop: 2, textAlign: 'center' }}
            >
              {message}
            </Typography>
          )}

          {/* Enlace para regresar al Login */}
          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Grid item>
              <Typography variant="body2">
                ¿Ya tienes una cuenta?{' '}
                <Link onClick={() => navigate('/login')} sx={{ cursor: 'pointer' }} color="primary">
                  Inicia sesión
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
