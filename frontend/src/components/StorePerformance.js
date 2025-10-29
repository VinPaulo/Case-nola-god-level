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
  Chip,
  Rating
} from '@mui/material';
import { api } from '../services/api';

const StorePerformance = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadStoreData();
    }
  }, [brandId]);

  const loadStoreData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/revenue-by-store?brand_id=${brandId}&limit=20`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar dados das lojas');
      console.error('Error loading store data:', err);
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
        <Typography color="textSecondary">Nenhuma loja encontrada</Typography>
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

  const getPerformanceRating = (revenue, maxRevenue) => {
    const percentage = (revenue / maxRevenue) * 100;
    if (percentage >= 80) return 5;
    if (percentage >= 60) return 4;
    if (percentage >= 40) return 3;
    if (percentage >= 20) return 2;
    return 1;
  };

  const maxRevenue = Math.max(...data.map(store => store.revenue));

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Loja</strong></TableCell>
            <TableCell><strong>Localização</strong></TableCell>
            <TableCell align="right"><strong>Receita</strong></TableCell>
            <TableCell align="right"><strong>Vendas</strong></TableCell>
            <TableCell align="right"><strong>Ticket Médio</strong></TableCell>
            <TableCell align="center"><strong>Performance</strong></TableCell>
            <TableCell align="center"><strong>Posição</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((store, index) => (
            <TableRow key={store.store_name} hover>
              <TableCell>
                <Typography variant="body2" fontWeight="bold">
                  {store.store_name}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="textSecondary">
                  {store.city}, {store.state}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {formatCurrency(store.revenue)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {formatNumber(store.sales_count)}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(store.average_ticket)}
              </TableCell>
              <TableCell align="center">
                <Rating
                  value={getPerformanceRating(store.revenue, maxRevenue)}
                  readOnly
                  size="small"
                />
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={`#${index + 1}`}
                  color={index < 5 ? 'primary' : 'default'}
                  size="small"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StorePerformance;
