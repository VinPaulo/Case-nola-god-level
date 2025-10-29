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

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'ativo':
      case 'active':
        return 'success';
      case 'inativo':
      case 'inactive':
        return 'error';
      case 'recorrente':
      case 'recurring':
        return 'primary';
      default:
        return 'default';
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Cliente</strong></TableCell>
            <TableCell><strong>E-mail</strong></TableCell>
            <TableCell align="right"><strong>Compras</strong></TableCell>
            <TableCell align="right"><strong>Ticket Médio</strong></TableCell>
            <TableCell><strong>Última Compra</strong></TableCell>
            <TableCell align="center"><strong>Status</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((customer, index) => (
            <TableRow key={customer.customer_name || customer.email || index} hover>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                  {customer.customer_name || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                  {customer.email || '-'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {formatNumber(customer.total_compras)}
              </TableCell>
              <TableCell align="right">
                {formatCurrency(customer.ticket_medio)}
              </TableCell>
              <TableCell>
                {customer.ultima_compra ?
                  new Date(customer.ultima_compra).toLocaleDateString('pt-BR') :
                  '-'
                }
              </TableCell>
              <TableCell align="center">
                <Chip
                  label={customer.status_retencao || 'Desconhecido'}
                  color={getStatusColor(customer.status_retencao)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomerRetention;
