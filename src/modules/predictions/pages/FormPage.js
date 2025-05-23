import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Grid, MenuItem, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../config';

const FormPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    grado: '',
    seccion: '',
    conducta: '',
    distrito: '',
    asistencia: '',
    matematicas: '',
    comunicacion: '',
    ciencias_sociales: '',
    cta: '',
    ingles: ''
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (['edad', 'conducta', 'asistencia', 'matematicas', 'comunicacion', 'ciencias_sociales', 'cta', 'ingles'].includes(name)) {
      if (!/^\d*$/.test(value)) return;
      const intValue = parseInt(value, 10);

      if (name === 'edad' && (intValue < 12 || intValue > 17)) return;
      if (['conducta', 'asistencia', 'matematicas', 'comunicacion', 'ciencias_sociales', 'cta', 'ingles'].includes(name) && (intValue < 5 || intValue > 20)) return;
    }

    if (name === 'distrito' && !['Puente Piedra', 'Ventanilla', 'Comas', 'Los Olivos', 'Callao'].includes(value)) return;
    if (name === 'seccion' && !['A', 'B'].includes(value.toUpperCase())) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${config.API_URL}${config.ENDPOINTS.ALUMNO}`, formData);
      const prediction = response.data.response.prediction;
      setMessage(`Posible a desertar: ${prediction ? 'SI' : 'NO'}`);
    } catch (error) {
      console.error('Error al registrar al alumno:', error);
      setMessage('Error al registrar al alumno');
    }
  };

  return (
    <div style={{
      background: '#f0f2f5',
      minHeight: '100vh',
      paddingTop: '50px',
      paddingBottom: '50px'
    }}>
      <Container maxWidth="sm">
        <Card elevation={6} style={{ borderRadius: '15px', padding: '20px' }}>
          <CardContent>
            <Typography variant="h4" align="center" gutterBottom>
              Registro de Alumno
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField name="nombre" fullWidth label="Nombre" onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField name="apellido" fullWidth label="Apellido" onChange={handleChange} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="edad"
                    fullWidth
                    label="Edad (12 a 17)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 12, max: 17 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="grado"
                    fullWidth
                    label="Grado (1ero a 5to)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 1, max: 5 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="seccion"
                    fullWidth
                    label="Sección (A o B)"
                    onChange={handleChange}
                    inputProps={{ maxLength: 1 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="conducta"
                    fullWidth
                    label="Conducta (5 a 20)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 5, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    name="distrito"
                    fullWidth
                    label="Distrito"
                    value={formData.distrito}
                    onChange={handleChange}
                  >
                    {['Puente Piedra', 'Ventanilla', 'Comas', 'Los Olivos', 'Callao'].map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="asistencia"
                    fullWidth
                    label="Asistencia (5 a 20)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 5, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="matematicas"
                    fullWidth
                    label="Matemáticas (5 a 20)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 5, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="comunicacion"
                    fullWidth
                    label="Comunicación (5 a 20)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 5, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="ciencias_sociales"
                    fullWidth
                    label="Ciencias Sociales (5 a 20)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 5, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="cta"
                    fullWidth
                    label="CTA (5 a 20)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 5, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="ingles"
                    fullWidth
                    label="Inglés (5 a 20)"
                    type="number"
                    onChange={handleChange}
                    inputProps={{ min: 5, max: 20 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Registrar Alumno
                  </Button>
                </Grid>
              </Grid>
            </form>

            {message && (
              <Typography variant="h6" align="center" color="secondary" style={{ marginTop: '20px' }}>
                {message}
              </Typography>
            )}

            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate('/historial')}
              style={{ marginTop: '20px' }}
            >
              Ver Mi Historial
            </Button>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default FormPage;