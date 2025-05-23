import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const DashboardPage = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#f0f2f5',
        minHeight: '100vh',
        paddingTop: '50px',
        paddingBottom: '50px'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h3" align="center" gutterBottom>
          Dashboard
        </Typography>
      </Container>
    </Box>
  );
};

export default DashboardPage; 