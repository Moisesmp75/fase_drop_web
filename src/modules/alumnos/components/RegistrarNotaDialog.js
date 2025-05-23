import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box
} from '@mui/material';

const RegistrarNotaDialog = ({ open, onClose, alumno, onSave }) => {
  const [formData, setFormData] = useState({
    grado: '',
    seccion: '',
    tipoPeriodo: 'TRIMESTRE',
    valorPeriodo: '',
    anio: new Date().getFullYear(),
    matematicas: '',
    comunicacion: '',
    ciencias_sociales: '',
    cta: '',
    ingles: '',
    asistencia: '',
    conducta: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    const notaData = {
      ...formData,
      alumnoId: alumno.id,
      grado: parseInt(formData.grado),
      valorPeriodo: parseInt(formData.valorPeriodo),
      anio: parseInt(formData.anio),
      matematicas: parseInt(formData.matematicas),
      comunicacion: parseInt(formData.comunicacion),
      ciencias_sociales: parseInt(formData.ciencias_sociales),
      cta: parseInt(formData.cta),
      ingles: parseInt(formData.ingles),
      asistencia: parseInt(formData.asistencia),
      conducta: parseInt(formData.conducta)
    };
    onSave(notaData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Registrar Nota - {alumno?.nombre} {alumno?.apellido}
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Grado"
                name="grado"
                value={formData.grado}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4, 5].map((grado) => (
                  <MenuItem key={grado} value={grado}>
                    {grado}°
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Sección"
                name="seccion"
                value={formData.seccion}
                onChange={handleChange}
                required
              >
                {['A', 'B'].map((seccion) => (
                  <MenuItem key={seccion} value={seccion}>
                    {seccion}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Tipo de Periodo"
                name="tipoPeriodo"
                value={formData.tipoPeriodo}
                onChange={handleChange}
                required
              >
                <MenuItem value="BIMESTRE">Bimestre</MenuItem>
                <MenuItem value="TRIMESTRE">Trimestre</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label="Valor del Periodo"
                name="valorPeriodo"
                value={formData.valorPeriodo}
                onChange={handleChange}
                required
              >
                {[1, 2, 3, 4].map((valor) => (
                  <MenuItem key={valor} value={valor}>
                    {valor}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Año"
                name="anio"
                type="number"
                value={formData.anio}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Matemáticas"
                name="matematicas"
                type="number"
                value={formData.matematicas}
                onChange={handleChange}
                inputProps={{ min: 5, max: 20 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Comunicación"
                name="comunicacion"
                type="number"
                value={formData.comunicacion}
                onChange={handleChange}
                inputProps={{ min: 5, max: 20 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Ciencias Sociales"
                name="ciencias_sociales"
                type="number"
                value={formData.ciencias_sociales}
                onChange={handleChange}
                inputProps={{ min: 5, max: 20 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CTA"
                name="cta"
                type="number"
                value={formData.cta}
                onChange={handleChange}
                inputProps={{ min: 5, max: 20 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Inglés"
                name="ingles"
                type="number"
                value={formData.ingles}
                onChange={handleChange}
                inputProps={{ min: 5, max: 20 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Asistencia"
                name="asistencia"
                type="number"
                value={formData.asistencia}
                onChange={handleChange}
                inputProps={{ min: 5, max: 20 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Conducta"
                name="conducta"
                type="number"
                value={formData.conducta}
                onChange={handleChange}
                inputProps={{ min: 5, max: 20 }}
                required
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegistrarNotaDialog; 