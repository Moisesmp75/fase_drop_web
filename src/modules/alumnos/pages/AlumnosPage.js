import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Grid,
  Snackbar,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import config from '../../../config';
import { getUser } from '../../../utils/auth';
import RegistrarNotaDialog from '../components/RegistrarNotaDialog';
import NotasAlumnoDialog from '../components/NotasAlumnoDialog';

const AlumnosPage = () => {
  const [alumnos, setAlumnos] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: '', dni: '' });
  const [openDialog, setOpenDialog] = useState(false);
  const [openNotaDialog, setOpenNotaDialog] = useState(false);
  const [openNotasDialog, setOpenNotasDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAlumno, setSelectedAlumno] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    edad: '',
    distrito: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'error'
  });

  const distritos = ['Puente Piedra', 'Ventanilla', 'Comas', 'Los Olivos', 'Callao'];

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const showError = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'error'
    });
  };

  const showSuccess = (message) => {
    setSnackbar({
      open: true,
      message,
      severity: 'success'
    });
  };

  const fetchAlumnos = async () => {
    try {
      const response = await axios.get(`${config.API_URL}${config.ENDPOINTS.ALUMNO}`);
      setAlumnos(Array.isArray(response.data.alumnos) ? response.data.alumnos : []);
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      setAlumnos([]);
      showError(error.response?.data?.message || 'Error al obtener la lista de alumnos');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getUser();
      const alumnoData = {
        ...formData,
        idUsuarioResponsable: user.id
      };
      await axios.post(`${config.API_URL}${config.ENDPOINTS.ALUMNO}`, alumnoData);
      setOpenDialog(false);
      showSuccess('Alumno registrado exitosamente');
      fetchAlumnos();
      setFormData({
        nombre: '',
        apellido: '',
        dni: '',
        edad: '',
        distrito: ''
      });
    } catch (error) {
      console.error('Error al registrar alumno:', error);
      showError(error.response?.data?.message || 'Error al registrar el alumno');
    }
  };

  const handleRegistrarNota = (alumno) => {
    setSelectedAlumno(alumno);
    setOpenNotaDialog(true);
  };

  const handleSaveNota = async (notaData) => {
    try {
      await axios.post(`${config.API_URL}${config.ENDPOINTS.NOTA}`, notaData);
      setOpenNotaDialog(false);
      showSuccess('Nota registrada exitosamente');
    } catch (error) {
      console.error('Error al registrar nota:', error);
      showError(error.response?.data?.message || 'Error al registrar la nota');
    }
  };

  const handleVerNotas = (alumno) => {
    setSelectedAlumno(alumno);
    setOpenNotasDialog(true);
  };

  const handleDeleteClick = (alumno) => {
    setSelectedAlumno(alumno);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.API_URL}${config.ENDPOINTS.ALUMNO}/${selectedAlumno.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenDeleteDialog(false);
      showSuccess('Alumno eliminado exitosamente');
      fetchAlumnos();
    } catch (error) {
      console.error('Error al eliminar alumno:', error);
      showError(error.response?.data?.message || 'Error al eliminar el alumno');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Gestión de Alumnos
        </Typography>

        {/* Filtros */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Buscar por Nombre"
                value={filtros.nombre}
                onChange={(e) => setFiltros(prev => ({ ...prev, nombre: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Buscar por DNI"
                value={filtros.dni}
                onChange={(e) => setFiltros(prev => ({ ...prev, dni: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenDialog(true)}
                fullWidth
              >
                Nuevo Alumno
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabla de Alumnos */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Apellido</TableCell>
                <TableCell>DNI</TableCell>
                <TableCell>Edad</TableCell>
                <TableCell>Distrito</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {alumnos
                .filter(alumno => 
                  alumno.nombre.toLowerCase().includes(filtros.nombre.toLowerCase()) &&
                  alumno.dni.includes(filtros.dni)
                )
                .map((alumno) => (
                  <TableRow key={alumno.id}>
                    <TableCell>{alumno.nombre}</TableCell>
                    <TableCell>{alumno.apellido}</TableCell>
                    <TableCell>{alumno.dni}</TableCell>
                    <TableCell>{alumno.edad}</TableCell>
                    <TableCell>{alumno.distrito}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleRegistrarNota(alumno)}
                        sx={{ mr: 1 }}
                      >
                        Registrar Nota
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleVerNotas(alumno)}
                        sx={{ mr: 1 }}
                      >
                        Ver Notas
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteClick(alumno)}
                        size="small"
                        sx={{ 
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)'
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Diálogo para nuevo alumno */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Registrar Nuevo Alumno</DialogTitle>
          <DialogContent>
            <Box component="form" sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="DNI"
                    name="dni"
                    value={formData.dni}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Edad"
                    name="edad"
                    type="number"
                    value={formData.edad}
                    onChange={handleChange}
                    inputProps={{ min: 12, max: 17 }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    select
                    label="Distrito"
                    name="distrito"
                    value={formData.distrito}
                    onChange={handleChange}
                    required
                  >
                    {distritos.map((distrito) => (
                      <MenuItem key={distrito} value={distrito}>
                        {distrito}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo para registrar nota */}
        <RegistrarNotaDialog
          open={openNotaDialog}
          onClose={() => setOpenNotaDialog(false)}
          alumno={selectedAlumno}
          onSave={handleSaveNota}
        />

        {/* Diálogo para ver notas */}
        <NotasAlumnoDialog
          open={openNotasDialog}
          onClose={() => setOpenNotasDialog(false)}
          alumno={selectedAlumno}
        />

        {/* Diálogo de confirmación para eliminar */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogContent>
            <Typography>
              ¿Está seguro que desea eliminar al alumno {selectedAlumno?.nombre} {selectedAlumno?.apellido}?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
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
    </Box>
  );
};

export default AlumnosPage; 