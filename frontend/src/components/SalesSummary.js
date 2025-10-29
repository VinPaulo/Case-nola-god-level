import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  AttachMoney,
  ShoppingCart,
  TrendingUp,
  LocalShipping
} from '@mui/icons-material';
import { api } from '../services/api';

const MetricCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="h2" color={color}>
            {value}
          </Typography>
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const SalesSummary = ({ brandId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadSummary();
    }
  }, [brandId]);

  const loadSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/sales/summary?brand_id=${brandId}`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar resumo de vendas');
      console.error('Error loading summary:', err);
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

  if (!data) {
    return <Alert severity="info">Nenhum dado encontrado</Alert>;
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
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Total de Vendas"
          value={formatNumber(data.total_sales)}
          icon={<ShoppingCart sx={{ fontSize: 40 }} />}
          color="primary"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Receita Total"
          value={formatCurrency(data.total_revenue)}
          icon={<AttachMoney sx={{ fontSize: 40 }} />}
          color="success"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(data.average_ticket)}
          icon={<TrendingUp sx={{ fontSize: 40 }} />}
          color="info"
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MetricCard
          title="Taxa de Entrega"
          value={formatCurrency(data.total_delivery_fees)}
          icon={<LocalShipping sx={{ fontSize: 40 }} />}
          color="warning"
        />
      </Grid>
    </Grid>
  );
};

export default SalesSummary;
