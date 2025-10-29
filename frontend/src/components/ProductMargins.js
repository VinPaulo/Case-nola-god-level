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

const ProductMargins = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadMarginsData();
    }
  }, [brandId]);

  const loadMarginsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/product-margins?brand_id=${brandId}&limit=10`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar margens de produtos');
      console.error('Error loading margins data:', err);
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

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Produto</strong></TableCell>
            <TableCell align="right"><strong>Preço Médio</strong></TableCell>
            <TableCell align="right"><strong>Margem %</strong></TableCell>
            <TableCell align="right"><strong>Lucro Total</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.produto || index} hover>
              <TableCell>
                <Typography variant="body2" noWrap sx={{ maxWidth: 250 }}>
                  {product.produto || 'Produto'}
                </Typography>
              </TableCell>
              <TableCell align="right">
                {formatCurrency(product.preco_medio)}
              </TableCell>
              <TableCell align="right">
                <Typography color={product.margem_percentual < 20 ? 'error.main' : 'success.main'}>
                  {formatPercentage(product.margem_percentual)}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {formatCurrency(product.lucro_total)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductMargins;
