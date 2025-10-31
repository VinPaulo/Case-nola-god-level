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

const CustomerRetention = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadRetentionData();
    }
  }, [brandId]);

  const loadRetentionData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/customer-retention?brand_id=${brandId}`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar retenção de clientes');
      console.error('Error loading retention data:', err);
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

  const formatPercentage = (value) => {
    return `${(parseFloat(value) || 0).toFixed(1)}%`;
  };

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <TableContainer component={Paper} sx={{ height: '100%' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell align="right"><strong>Total Compras</strong></TableCell>
              <TableCell align="right"><strong>Valor Total Gasto</strong></TableCell>
              <TableCell align="right"><strong>Última Compra</strong></TableCell>
              <TableCell align="right"><strong>Dias Desde Última Compra</strong></TableCell>
              <TableCell align="right"><strong>Status</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((customer, index) => (
              <TableRow key={customer.customer_name || index} hover>
                <TableCell>{customer.customer_name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell align="right">{customer.total_compras}</TableCell>
                <TableCell align="right">R$ {(parseFloat(customer.valor_total_gasto) || 0).toFixed(2)}</TableCell>
                <TableCell align="right">{customer.ultima_compra}</TableCell>
                <TableCell align="right">{customer.dias_desde_ultima_compra}</TableCell>
                <TableCell align="right">
                  <Typography color={customer.dias_desde_ultima_compra <= 30 ? 'success.main' : customer.dias_desde_ultima_compra <= 90 ? 'warning.main' : 'error.main'}>
                    {customer.dias_desde_ultima_compra <= 30 ? 'Ativo' : customer.dias_desde_ultima_compra <= 90 ? 'Inativo' : 'Perdido'}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerRetention;
