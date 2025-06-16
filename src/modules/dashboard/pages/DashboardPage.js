import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Tooltip as MuiTooltip
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';
import config from '../../../config';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FilterListIcon from '@mui/icons-material/FilterList';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    anio: new Date().getFullYear(),
    grado: 'todos'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalAlumnos: 0,
    alumnosConPrediccionPositiva: 0,
    alumnosConPrediccionNegativa: 0,
    alumnosSinPrediccion: 0,
    distribucionGrados: [],
    promedioNotas: [],
    alumnosRiesgo: [],
    evolucionNotas: [],
    tendencias: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, [filters]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.API_URL}${config.ENDPOINTS.ALUMNO}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let alumnos = response.data.alumnos;
      
      // Aplicar filtros
      if (filters.grado !== 'todos') {
        alumnos = alumnos.filter(a => a.ultimoGrado === parseInt(filters.grado));
      }

      // Calcular estadísticas
      const totalAlumnos = alumnos.length;
      const alumnosConPrediccionPositiva = alumnos.filter(a => a.ultimaPrediccion).length;
      const alumnosConPrediccionNegativa = alumnos.filter(a => a.ultimaPrediccion === false).length;
      const alumnosSinPrediccion = alumnos.filter(a => a.ultimaPrediccion === null).length;
      
      // Distribución por grados
      const distribucionGrados = alumnos
        .filter(alumno => alumno.ultimoGrado && alumno.ultimaSeccion)
        .reduce((acc, alumno) => {
          const key = `${alumno.ultimoGrado}° ${alumno.ultimaSeccion}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

      // Promedio de notas por curso
      const promedioNotas = alumnos.reduce((acc, alumno) => {
        if (alumno.notas && alumno.notas.length > 0) {
          const ultimaNota = alumno.notas[0];
          acc.matematicas += ultimaNota.matematicas;
          acc.comunicacion += ultimaNota.comunicacion;
          acc.ciencias_sociales += ultimaNota.ciencias_sociales;
          acc.cta += ultimaNota.cta;
          acc.ingles += ultimaNota.ingles;
          acc.count++;
        }
        return acc;
      }, {
        matematicas: 0,
        comunicacion: 0,
        ciencias_sociales: 0,
        cta: 0,
        ingles: 0,
        count: 0
      });

      // Calcular promedios solo si hay notas
      Object.keys(promedioNotas).forEach(key => {
        if (key !== 'count') {
          promedioNotas[key] = promedioNotas.count > 0 
            ? (promedioNotas[key] / promedioNotas.count).toFixed(1)
            : 0;
        }
      });

      // Alumnos en riesgo
      const alumnosRiesgo = alumnos
        .filter(a => {
          if (!a.notas || a.notas.length === 0) return false;
          const ultimaNota = a.notas[0];
          const promedio = (
            ultimaNota.matematicas +
            ultimaNota.comunicacion +
            ultimaNota.ciencias_sociales +
            ultimaNota.cta +
            ultimaNota.ingles
          ) / 5;
          return promedio < 13;
        })
        .map(a => ({
          nombre: `${a.nombre} ${a.apellido}`,
          grado: `${a.ultimoGrado}° ${a.ultimaSeccion}`,
          notas: a.notas[0],
          promedio: (
            (a.notas[0].matematicas +
            a.notas[0].comunicacion +
            a.notas[0].ciencias_sociales +
            a.notas[0].cta +
            a.notas[0].ingles) / 5
          ).toFixed(1)
        }));

      // Calcular tendencias por bimestre
      const tendencias = alumnos.reduce((acc, alumno) => {
        if (alumno.notas && alumno.notas.length > 0) {
          alumno.notas.forEach(nota => {
            const key = `${nota.anio}-${nota.tipoPeriodo}-${nota.valorPeriodo}`;
            if (!acc[key]) {
              acc[key] = {
                periodo: `${nota.tipoPeriodo} ${nota.valorPeriodo}`,
                matematicas: 0,
                comunicacion: 0,
                ciencias_sociales: 0,
                cta: 0,
                ingles: 0,
                count: 0
              };
            }
            acc[key].matematicas += nota.matematicas;
            acc[key].comunicacion += nota.comunicacion;
            acc[key].ciencias_sociales += nota.ciencias_sociales;
            acc[key].cta += nota.cta;
            acc[key].ingles += nota.ingles;
            acc[key].count++;
          });
        }
        return acc;
      }, {});

      // Calcular promedios de tendencias
      Object.values(tendencias).forEach(tendencia => {
        Object.keys(tendencia).forEach(key => {
          if (key !== 'periodo' && key !== 'count') {
            tendencia[key] = (tendencia[key] / tendencia.count).toFixed(1);
          }
        });
        delete tendencia.count;
      });

      setDashboardData({
        totalAlumnos,
        alumnosConPrediccionPositiva,
        alumnosConPrediccionNegativa,
        alumnosSinPrediccion,
        distribucionGrados: Object.entries(distribucionGrados).map(([name, value]) => ({ name, value })),
        promedioNotas: Object.entries(promedioNotas)
          .filter(([key]) => key !== 'count')
          .map(([name, value]) => ({ name, value: parseFloat(value) })),
        alumnosRiesgo,
        tendencias: Object.values(tendencias)
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (event) => {
    setFilters(prev => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  };

  const exportToCSV = () => {
    const headers = ['Nombre', 'Grado', 'Sección', 'Matemáticas', 'Comunicación', 'Ciencias Sociales', 'CTA', 'Inglés', 'Predicción'];
    const data = dashboardData.alumnosRiesgo.map(alumno => [
      alumno.nombre,
      alumno.grado,
      alumno.notas.seccion,
      alumno.notas.matematicas,
      alumno.notas.comunicacion,
      alumno.notas.ciencias_sociales,
      alumno.notas.cta,
      alumno.notas.ingles,
      alumno.notas.prediccion ? 'Positiva' : 'Negativa'
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${filters.anio}_${filters.grado}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Dashboard
        </Typography>
        <Box>
          <MuiTooltip title="Filtros">
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterListIcon />
            </IconButton>
          </MuiTooltip>
          <MuiTooltip title="Exportar a CSV">
            <IconButton onClick={exportToCSV}>
              <FileDownloadIcon />
            </IconButton>
          </MuiTooltip>
        </Box>
      </Box>

      {showFilters && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Año</InputLabel>
                  <Select
                    name="anio"
                    value={filters.anio}
                    onChange={handleFilterChange}
                    label="Año"
                  >
                    <MenuItem value={2024}>2024</MenuItem>
                    <MenuItem value={2025}>2025</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Grado</InputLabel>
                  <Select
                    name="grado"
                    value={filters.grado}
                    onChange={handleFilterChange}
                    label="Grado"
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    <MenuItem value="1">1°</MenuItem>
                    <MenuItem value="2">2°</MenuItem>
                    <MenuItem value="3">3°</MenuItem>
                    <MenuItem value="4">4°</MenuItem>
                    <MenuItem value="5">5°</MenuItem>
                    <MenuItem value="6">6°</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Grid container spacing={3}>
        {/* Resumen General */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Resumen General
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Total de Alumnos:
                  </Typography>
                  <Typography variant="h4">
                    {dashboardData.totalAlumnos}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Alumnos con Predicción Positiva:
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {dashboardData.alumnosConPrediccionPositiva}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Alumnos con Predicción Negativa:
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {dashboardData.alumnosConPrediccionNegativa}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle1">
                    Alumnos sin Predicción:
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {dashboardData.alumnosSinPrediccion}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Distribución por Grados */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Distribución por Grados
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dashboardData.distribucionGrados}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {dashboardData.distribucionGrados.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Promedio de Notas por Curso */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Promedio de Notas por Curso
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.promedioNotas}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 20]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Promedio" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tendencias de Rendimiento */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tendencias de Rendimiento
              </Typography>
              <Box height={300}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dashboardData.tendencias}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="periodo" />
                    <YAxis domain={[0, 20]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="matematicas" stroke="#8884d8" name="Matemáticas" />
                    <Line type="monotone" dataKey="comunicacion" stroke="#82ca9d" name="Comunicación" />
                    <Line type="monotone" dataKey="ciencias_sociales" stroke="#ffc658" name="Ciencias Sociales" />
                    <Line type="monotone" dataKey="cta" stroke="#ff8042" name="CTA" />
                    <Line type="monotone" dataKey="ingles" stroke="#0088fe" name="Inglés" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Alumnos en Riesgo */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alumnos en Riesgo
              </Typography>
              <List>
                {dashboardData.alumnosRiesgo.map((alumno, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={alumno.nombre}
                        secondary={`Grado: ${alumno.grado} | Promedio: ${alumno.promedio}`}
                      />
                    </ListItem>
                    {index < dashboardData.alumnosRiesgo.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage; 