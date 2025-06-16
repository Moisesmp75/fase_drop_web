import React, { useState } from 'react';
import { 
  TextField, 
  Button, 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Paper, 
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar formato de correo electrónico
    if (!validateEmail(formData.email)) {
      setMessage('Por favor, ingrese un correo electrónico válido');
      return;
    }

    // Mostrar el modal de confirmación
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate('/login');
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
              error={message.includes('correo')}
              helperText={message.includes('correo') ? message : ''}
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

          {message && !message.includes('correo') && (
            <Typography
              variant="body1"
              color={message.includes("Error") ? "error" : "success"}
              sx={{ marginTop: 2, textAlign: 'center' }}
            >
              {message}
            </Typography>
          )}

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

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Registro Exitoso</DialogTitle>
        <DialogContent>
          <Typography>
            El equipo te mandará la confirmación de la creación de tu usuario al correo registrado.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RegisterPage;
