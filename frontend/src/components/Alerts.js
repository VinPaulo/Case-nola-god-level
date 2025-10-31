import React from 'react';
import {
  Alert,
  AlertTitle,
  Box,
  Typography,
  Chip,
  Stack
} from '@mui/material';
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const Alerts = ({ alerts, loading }) => {
  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Carregando alertas...
        </Typography>
      </Box>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="success" sx={{ mb: 1 }}>
          <AlertTitle>Sem Alertas</AlertTitle>
          Tudo funcionando bem! Não há alertas críticos no momento.
        </Alert>
      </Box>
    );
  }

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'info':
        return <InfoIcon />;
      case 'success':
        return <SuccessIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Alertas e Insights
      </Typography>
      <Stack spacing={2}>
        {alerts.map((alert, index) => (
          <Alert
            key={index}
            severity={getSeverityColor(alert.severity)}
            icon={getAlertIcon(alert.type)}
            sx={{ mb: 1 }}
          >
            <AlertTitle sx={{ fontWeight: 'bold' }}>
              {alert.message}
            </AlertTitle>
            <Box sx={{ mt: 1 }}>
              <Chip
                label={alert.severity === 'high' ? 'Crítico' :
                       alert.severity === 'medium' ? 'Atenção' : 'Informação'}
                size="small"
                color={alert.severity === 'high' ? 'error' :
                       alert.severity === 'medium' ? 'warning' : 'info'}
              />
            </Box>
          </Alert>
        ))}
      </Stack>
    </Box>
  );
};

export default Alerts;
