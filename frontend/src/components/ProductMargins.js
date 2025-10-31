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
      const response = await api.get(`/analytics/product-margins?brand_id=${brandId}`);
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
    const num = parseFloat(value) || 0;
    return `R$ ${num.toFixed(2)}`;
  };

  const formatPercentage = (value) => {
    const num = parseFloat(value) || 0;
    return `${num.toFixed(1)}%`;
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Produto</strong></TableCell>
            <TableCell align="right"><strong>Vendas Totais</strong></TableCell>
            <TableCell align="right"><strong>Receita Total</strong></TableCell>
            <TableCell align="right"><strong>Custo Estimado</strong></TableCell>
            <TableCell align="right"><strong>Margem Unitária</strong></TableCell>
            <TableCell align="right"><strong>Margem Percentual</strong></TableCell>
            <TableCell align="right"><strong>Lucro Total</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((product, index) => (
            <TableRow key={product.produto || index} hover>
              <TableCell>{product.produto}</TableCell>
              <TableCell align="right">{product.total_vendido}</TableCell>
              <TableCell align="right">{formatCurrency(product.receita_total)}</TableCell>
              <TableCell align="right">{formatCurrency(product.custo_estimado)}</TableCell>
              <TableCell align="right">{formatCurrency(product.margem_unitaria)}</TableCell>
              <TableCell align="right">{formatPercentage(product.margem_percentual)}</TableCell>
              <TableCell align="right">{formatCurrency(product.lucro_total)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductMargins;
