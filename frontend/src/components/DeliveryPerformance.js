import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { api } from '../services/api';

const DeliveryPerformance = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadDeliveryData();
    }
  }, [brandId]);

  const loadDeliveryData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/delivery-performance?brand_id=${brandId}`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar performance de entrega');
      console.error('Error loading delivery data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200}>
        <Typography color="textSecondary">Nenhum dado disponível</Typography>
      </Box>
    );
  }

  const formatTime = (minutes) => {
    if (isNaN(minutes) || minutes === null || minutes === undefined) return '0min 0s';
    return `${Math.floor(minutes)}min ${Math.round((minutes % 1) * 60)}s`;
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <TableContainer component={Paper} sx={{ height: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Canal</strong></TableCell>
              <TableCell align="right"><strong>Entregas Totais</strong></TableCell>
              <TableCell align="right"><strong>Tempo Médio (min)</strong></TableCell>
              <TableCell align="right"><strong>P90 (min)</strong></TableCell>
              <TableCell align="right"><strong>Taxa de Atraso (%)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.channel || index} hover>
                <TableCell>{item.channel}</TableCell>
                <TableCell align="right">{item.total_deliveries}</TableCell>
                <TableCell align="right">{formatTime(item.avg_time)}</TableCell>
                <TableCell align="right">{formatTime(item.p90_time)}</TableCell>
                <TableCell align="right">{((parseFloat(item.delay_rate) || 0).toFixed(1))}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DeliveryPerformance;
