import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Container, Typography, Table, TableHead, TableRow, TableCell, 
  TableBody, Grid, Card, CardContent, Paper 
} from '@mui/material';
import axios from 'axios';
import config from '../../../config';

const HistoryPage = ({ usuario_id }) => {

  const historialdata = [
    { nombre: 'Ana', apellido: 'García', grado: 3, seccion: 'A', prediccion: true },
    { nombre: 'Luis', apellido: 'Pérez', grado: 2, seccion: 'B', prediccion: false },
    { nombre: 'María', apellido: 'Lopez', grado: 1, seccion: 'A', prediccion: false },
    { nombre: 'Carlos', apellido: 'Ramírez', grado: 4, seccion: 'B', prediccion: true },
    { nombre: 'Sofía', apellido: 'Torres', grado: 5, seccion: 'A', prediccion: false },
    { nombre: 'Diego', apellido: 'Fernández', grado: 3, seccion: 'B', prediccion: true },
    { nombre: 'Valeria', apellido: 'Mendoza', grado: 2, seccion: 'A', prediccion: false },
    { nombre: 'Mateo', apellido: 'Ruiz', grado: 5, seccion: 'B', prediccion: false },
    { nombre: 'Isabella', apellido: 'Chávez', grado: 4, seccion: 'A', prediccion: true },
    { nombre: 'Sebastián', apellido: 'Vargas', grado: 1, seccion: 'B', prediccion: false }
  ];

  const [historial, setHistorial] = useState(historialdata);
  const [searchParams, setSearchParams] = useState({ nombre: '', apellido: '' });

  const fetchHistorial = async () => {
    try {
      const response = await axios.get(`${config.API_URL}${config.ENDPOINTS.ALUMNO}`, {
        params: { usuario_id, ...searchParams }
      });
      // setHistorial(response.data);
      setHistorial(historial)
    } catch (error) {
      console.error('Error al obtener el historial:', error);
    }
  };

  useEffect(() => {
    fetchHistorial();
    setHistorial(historial);
  }, []);

  const handleSearch = () => {
    fetchHistorial();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div style={{
      background: '#f0f2f5',
      minHeight: '100vh',
      paddingTop: '50px',
      paddingBottom: '50px'
    }}>
      <Container maxWidth="md">
        <Typography variant="h4" align="center" gutterBottom>
          Historial de Predicciones
        </Typography>

        {/* Filtros de búsqueda en una Card */}
        <Card elevation={6} style={{ marginBottom: '30px', borderRadius: '10px' }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="nombre"
                  label="Buscar por Nombre"
                  value={searchParams.nombre}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="apellido"
                  label="Buscar por Apellido"
                  value={searchParams.apellido}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button variant="contained" color="primary" onClick={handleSearch}>
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tabla */}
        <Paper elevation={6} style={{ borderRadius: '10px' }}>
          <Table>
            <TableHead style={{ backgroundColor: '#1976d2' }}>
              <TableRow>
                <TableCell style={{ color: 'white' }}>Nombre</TableCell>
                <TableCell style={{ color: 'white' }}>Apellido</TableCell>
                <TableCell style={{ color: 'white' }}>Grado</TableCell>
                <TableCell style={{ color: 'white' }}>Sección</TableCell>
                <TableCell style={{ color: 'white' }}>Deserción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {historial.map((registro, index) => (
                <TableRow key={index}>
                  <TableCell>{registro.nombre}</TableCell>
                  <TableCell>{registro.apellido}</TableCell>
                  <TableCell>{registro.grado}</TableCell>
                  <TableCell>{registro.seccion}</TableCell>
                  <TableCell>
                    {registro.prediccion ? (
                      <span style={{ color: 'red', fontWeight: 'bold' }}>Sí</span>
                    ) : (
                      <span style={{ color: 'green', fontWeight: 'bold' }}>No</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </div>
  );
};

export default HistoryPage;
