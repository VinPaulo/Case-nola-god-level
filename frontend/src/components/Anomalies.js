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
        <Typography color="textSecondary">Nenhuma anomalia encontrada</Typography>
      </Box>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const getAnomalyColor = (anomalia) => {
    switch (anomalia?.toLowerCase()) {
      case 'alta':
      case 'high':
        return 'warning';
      case 'baixa':
      case 'low':
        return 'error';
      case 'normal':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Data</strong></TableCell>
            <TableCell align="right"><strong>Vendas</strong></TableCell>
            <TableCell align="right"><strong>Receita</strong></TableCell>
            <TableCell align="center"><strong>Anomalia</strong></TableCell>
            <TableCell align="right"><strong>Variação Vendas %</strong></TableCell>
            <TableCell align="right"><strong>Variação Receita %</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.data || index} hover>
              <TableCell>
                {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '-'}
              </TableCell>
              <TableCell align="right">
                {formatNumber(item.vendas)}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(item.receita)}
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={item.anomalia || 'Normal'}
                  color={getAnomalyColor(item.anomalia)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="right">
                <Typography color={Math.abs(item.variacao_vendas_pct || 0) > 20 ? 'warning.main' : 'textSecondary'}>
                  {formatPercentage(item.variacao_vendas_pct)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography color={Math.abs(item.variacao_receita_pct || 0) > 20 ? 'warning.main' : 'textSecondary'}>
                  {formatPercentage(item.variacao_receita_pct)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Anomalies;
