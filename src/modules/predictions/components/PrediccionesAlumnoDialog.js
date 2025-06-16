import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  IconButton,
  DialogActions,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import config from '../../../config';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../utils/auth';

const PrediccionesAlumnoDialog = ({ open, onClose, alumno, onNotaDeleted }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [notas, setNotas] = useState([]);
  const navigate = useNavigate();

  // Actualizar notas cuando cambia el alumno
  React.useEffect(() => {
    if (alumno) {
      setNotas(alumno.notas || []);
    }
  }, [alumno]);

  if (!alumno) return null;

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleDeleteNota = async (notaId) => {
    try {
      await axios.delete(`${config.API_URL}${config.ENDPOINTS.NOTA}/${alumno.id}/${notaId}`);
      
      // Actualizar localmente el array de notas
      setNotas(prevNotas => prevNotas.filter(nota => nota.id !== notaId));
      
      // Actualizar el alumno en el componente padre
      if (onNotaDeleted) {
        onNotaDeleted({
          ...alumno,
          notas: notas.filter(nota => nota.id !== notaId)
        });
      }

      setSnackbar({
        open: true,
        message: 'Nota eliminada exitosamente',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      if (error.response?.status === 401) {
        // Token expirado
        logout();
        navigate('/login');
      } else {
        setSnackbar({
          open: true,
          message: error.response?.data?.message || 'Error al eliminar la nota',
          severity: 'error'
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Historial de Predicciones - {alumno.nombre} {alumno.apellido}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Información del Alumno:
          </Typography>
          <Typography variant="body2" paragraph>
            DNI: {alumno.dni} | Edad: {alumno.edad} | Distrito: {alumno.distrito}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Historial de Predicciones:
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Año</TableCell>
                  <TableCell>Grado</TableCell>
                  <TableCell>Sección</TableCell>
                  <TableCell>Periodo</TableCell>
                  <TableCell>Predicción</TableCell>
                  <TableCell>Comentario</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notas.map((nota) => (
                  <TableRow key={nota.id}>
                    <TableCell>{nota.anio}</TableCell>
                    <TableCell>{nota.grado}°</TableCell>
                    <TableCell>{nota.seccion}</TableCell>
                    <TableCell>{nota.tipoPeriodo} {nota.valorPeriodo}</TableCell>
                    <TableCell>
                      <span style={{ 
                        color: nota.prediccion ? 'red' : 'green',
                        fontWeight: 'bold'
                      }}>
                        {nota.prediccion ? 'Sí' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell>{nota.comentario || '-'}</TableCell>
                    <TableCell>
                      <IconButton 
                        color="error" 
                        onClick={() => handleDeleteNota(nota.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {notas.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No hay notas registradas
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
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
    </Dialog>
  );
};

export default PrediccionesAlumnoDialog; 