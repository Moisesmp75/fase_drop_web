import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, Link, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${config.API_URL}${config.ENDPOINTS.LOGIN}`, formData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      console.log('Inicio de sesión exitoso:', response.data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    }
  };

  const handleRecoverySubmit = (e) => {
    e.preventDefault();
    if (!recoveryEmail) {
      return;
    }
    setOpenDialog(false);
    setError('Se ha enviado un correo para seguir los pasos en cambiar tu contraseña');
    setRecoveryEmail('');
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
            Bienvenido
          </Typography>

          <Typography variant="subtitle1" align="center" color="textSecondary" gutterBottom>
            Inicia sesión para continuar
          </Typography>

          {error && (
            <Typography color={error.includes('Error') ? "error" : "success"} align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
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
              Ingresar
            </Button>
          </form>

          <Grid container justifyContent="center" sx={{ mt: 3 }}>
            <Grid item>
              <Typography variant="body2">
                ¿No tienes cuenta?{' '}
                <Link onClick={() => navigate('/register')} underline="hover" sx={{ cursor: 'pointer' }}>
                  Regístrate
                </Link>
              </Typography>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" sx={{ mt: 1 }}>
            <Grid item>
              <Link 
                onClick={() => setOpenDialog(true)} 
                underline="hover" 
                sx={{ cursor: 'pointer' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      <Dialog 
        open={openDialog} 
        onClose={() => {
          setOpenDialog(false);
          setRecoveryEmail('');
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Recuperar Contraseña</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleRecoverySubmit} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Correo Electrónico"
              type="email"
              fullWidth
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => {
              setOpenDialog(false);
              setRecoveryEmail('');
            }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleRecoverySubmit} 
            color="primary"
            disabled={!recoveryEmail}
          >
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LoginPage;
