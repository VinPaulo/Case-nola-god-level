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
  Typography,
  Chip
} from '@mui/material';
import { api } from '../services/api';

const Anomalies = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadAnomaliesData();
    }
  }, [brandId]);

  const loadAnomaliesData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/anomalies?brand_id=${brandId}`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar anomalias');
      console.error('Error loading anomalies data:', err);
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
        <Typography color="textSecondary">Nenhuma anomalia detectada</Typography>
      </Box>
    );
  }

  const getSeverityColor = (severity) => {
    if (!severity) return 'default';
    switch (severity.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <TableContainer component={Paper} sx={{ height: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell><strong>Vendas</strong></TableCell>
              <TableCell><strong>Receita</strong></TableCell>
              <TableCell><strong>Ticket Médio</strong></TableCell>
              <TableCell><strong>Anomalia</strong></TableCell>
              <TableCell><strong>Variação Vendas (%)</strong></TableCell>
              <TableCell><strong>Variação Receita (%)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((anomaly, index) => (
              <TableRow key={anomaly.data || index} hover>
                <TableCell>{anomaly.data}</TableCell>
                <TableCell>{anomaly.vendas}</TableCell>
                <TableCell>R$ {(parseFloat(anomaly.receita) || 0).toFixed(2)}</TableCell>
                <TableCell>R$ {(parseFloat(anomaly.ticket_medio) || 0).toFixed(2)}</TableCell>
                <TableCell>
                  <Chip label={anomaly.anomalia} color={anomaly.anomalia.includes('Queda') ? 'error' : 'warning'} size="small" />
                </TableCell>
                <TableCell>{(parseFloat(anomaly.variacao_vendas_pct) || 0).toFixed(1)}%</TableCell>
                <TableCell>{(parseFloat(anomaly.variacao_receita_pct) || 0).toFixed(1)}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Anomalies;
