import React, { useEffect, useState } from 'react';
import axios from 'axios';
import config from '../../../config';
import { 
  TextField, Button, Container, Typography, Table, TableHead, TableRow, TableCell, 
  TableBody, Grid, Card, CardContent, Paper, Box, MenuItem, Snackbar, Alert
} from '@mui/material';
import PrediccionesAlumnoDialog from '../components/PrediccionesAlumnoDialog';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../utils/auth';

const HistoryPage = ({ usuario_id }) => {
  const [historial, setHistorial] = useState([]);
  const [searchParams, setSearchParams] = useState({ 
    nombre: '', 
    apellido: '',
    grado: '',
    seccion: ''
  });
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchHistorial = async () => {
    try {
      const response = await axios.get(`${config.API_URL}${config.ENDPOINTS.ALUMNO}`, {
        params: { usuario_id, ...searchParams }
      });
      setHistorial(historial)
    } catch (error) {
      console.error('Error al obtener el historial:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      }
    }
  };

  const fetchAlumnos = async (params = {}) => {
    setLoading(true);
    try {
      if (params.grado || params.seccion) {
        const response = await axios.get(`${config.API_URL}${config.ENDPOINTS.ALUMNO}`, {
          params: { usuario_id, ...params }
        });
        setAlumnos(Array.isArray(response.data.alumnos) ? response.data.alumnos : []);
      } else {
        const response = await axios.get(`${config.API_URL}${config.ENDPOINTS.ALUMNO}`, {
          params: { usuario_id }
        });
        const todosAlumnos = Array.isArray(response.data.alumnos) ? response.data.alumnos : [];
        const alumnosFiltrados = todosAlumnos.filter(alumno => {
          const nombreMatch = alumno.nombre?.toLowerCase().includes(params.nombre?.toLowerCase() || '');
          const apellidoMatch = alumno.apellido?.toLowerCase().includes(params.apellido?.toLowerCase() || '');
          return nombreMatch && apellidoMatch;
        });
        setAlumnos(alumnosFiltrados);
      }
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Error al obtener la lista de alumnos',
          severity: 'error'
        });
      }
      setAlumnos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlumnos();
  }, []);

  useEffect(() => {
    fetchHistorial();
  }, []);

  const handleSearch = () => {
    fetchAlumnos(searchParams);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prevState => ({ ...prevState, [name]: value }));
  };

  const handleRowClick = (alumno) => {
    setSelectedAlumno(alumno);
    setOpenDialog(true);
  };

  const handleNotaDeleted = (alumnoActualizado) => {
    // Actualizar localmente el alumno en el array de alumnos
    setAlumnos(prevAlumnos => 
      prevAlumnos.map(alumno => 
        alumno.id === alumnoActualizado.id ? alumnoActualizado : alumno
      )
    );
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
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="grado"
                  label="Grado"
                  value={searchParams.grado}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="">Todos</MenuItem>
                  {[1, 2, 3, 4, 5].map((grado) => (
                    <MenuItem key={grado} value={grado}>
                      {grado}°
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  name="seccion"
                  label="Sección"
                  value={searchParams.seccion}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="">Todas</MenuItem>
                  {['A', 'B'].map((seccion) => (
                    <MenuItem key={seccion} value={seccion}>
                      {seccion}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button variant="contained" color="primary" onClick={handleSearch}>
                  Buscar
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

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
              {alumnos.map((alumno, index) => (
                <TableRow 
                  key={index}
                  onClick={() => handleRowClick(alumno)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  <TableCell>{alumno.nombre}</TableCell>
                  <TableCell>{alumno.apellido}</TableCell>
                  <TableCell>{alumno.ultimoGrado}</TableCell>
                  <TableCell>{alumno.ultimaSeccion}</TableCell>
                  <TableCell>
                    {alumno.ultimaPrediccion ? (
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

        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h5">Historial</Typography>
            {loading ? (
              <Typography>Cargando...</Typography>
            ) : (
              <Typography variant="body1">
                Cantidad de alumnos encontrados: <b>{alumnos.length}</b>
              </Typography>
            )}
          </Paper>
        </Box>

        <PrediccionesAlumnoDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          alumno={selectedAlumno}
          onNotaDeleted={handleNotaDeleted}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </div>
  );
};

export default HistoryPage;
