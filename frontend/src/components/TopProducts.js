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

const TopProducts = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadTopProducts();
    }
  }, [brandId]);

  const loadTopProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/top-products?brand_id=${brandId}&limit=10`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar produtos mais vendidos');
      console.error('Error loading top products:', err);
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
        <Typography color="textSecondary">Nenhum produto encontrado</Typography>
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

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Produto</strong></TableCell>
            <TableCell align="right"><strong>Quantidade</strong></TableCell>
            <TableCell align="right"><strong>Receita</strong></TableCell>
            <TableCell align="right"><strong>Vendas</strong></TableCell>
            <TableCell align="center"><strong>Posição</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.product_name} hover>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                  {product.product_name}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {formatNumber(product.total_quantity)}
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {formatCurrency(product.total_revenue)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {formatNumber(product.sales_count)}
              </TableCell>
              <TableCell align="center">
                <Chip 
                  label={`#${index + 1}`}
                  color={index < 3 ? 'primary' : 'default'}
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

export default TopProducts;
