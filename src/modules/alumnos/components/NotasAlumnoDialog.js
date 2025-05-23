import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Typography
} from '@mui/material';
import axios from 'axios';
import config from '../../../config';

const NotasAlumnoDialog = ({ open, onClose, alumno }) => {
  const [notas, setNotas] = useState([]);
  const [filtros, setFiltros] = useState({
    anio: '',
    grado: ''
  });

  useEffect(() => {
    if (open && alumno) {
      fetchNotas();
    }
  }, [open, alumno, filtros]);

  const fetchNotas = async () => {
    try {
      const response = await axios.get(`${config.API_URL}${config.ENDPOINTS.NOTA}?alumnoId=${alumno.id}`);
      setNotas(Array.isArray(response.data.notas) ? response.data.notas : []);
    } catch (error) {
      console.error('Error al obtener notas:', error);
      setNotas([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const notasFiltradas = notas.filter(nota => {
    const cumpleAnio = filtros.anio ? nota.anio === parseInt(filtros.anio) : true;
    const cumpleGrado = filtros.grado ? nota.grado === parseInt(filtros.grado) : true;
    return cumpleAnio && cumpleGrado;
  });
  
  const calcularPromedio = (nota) => {
    const materias = [
      nota.matematicas,
      nota.comunicacion,
      nota.ciencias_sociales,
      nota.cta,
      nota.ingles
    ];
    return (materias.reduce((a, b) => a + b, 0) / materias.length).toFixed(2);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Notas de {alumno?.nombre} {alumno?.apellido}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Año"
                name="anio"
                value={filtros.anio}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                {[2023, 2024, 2025].map((anio) => (
                  <MenuItem key={anio} value={anio}>
                    {anio}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Grado"
                name="grado"
                value={filtros.grado}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                {[1, 2, 3, 4, 5].map((grado) => (
                  <MenuItem key={grado} value={grado}>
                    {grado}°
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Año</TableCell>
                <TableCell>Periodo</TableCell>
                <TableCell>Grado</TableCell>
                <TableCell>Sección</TableCell>
                <TableCell>Matemáticas</TableCell>
                <TableCell>Comunicación</TableCell>
                <TableCell>Ciencias Sociales</TableCell>
                <TableCell>CTA</TableCell>
                <TableCell>Inglés</TableCell>
                <TableCell>Asistencia</TableCell>
                <TableCell>Conducta</TableCell>
                <TableCell>Promedio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notasFiltradas.map((nota) => (
                <TableRow key={nota.id}>
                  <TableCell>{nota.anio}</TableCell>
                  <TableCell>{nota.tipoPeriodo} {nota.valorPeriodo}</TableCell>
                  <TableCell>{nota.grado}°</TableCell>
                  <TableCell>{nota.seccion}</TableCell>
                  <TableCell>{nota.matematicas}</TableCell>
                  <TableCell>{nota.comunicacion}</TableCell>
                  <TableCell>{nota.ciencias_sociales}</TableCell>
                  <TableCell>{nota.cta}</TableCell>
                  <TableCell>{nota.ingles}</TableCell>
                  <TableCell>{nota.asistencia}</TableCell>
                  <TableCell>{nota.conducta}</TableCell>
                  <TableCell>{calcularPromedio(nota)}</TableCell>
                </TableRow>
              ))}
              {notasFiltradas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13} align="center">
                    <Typography variant="body1" sx={{ py: 2 }}>
                      No hay notas registradas para los filtros seleccionados
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default NotasAlumnoDialog; 