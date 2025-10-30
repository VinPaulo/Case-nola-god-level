import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  Chip,
  Paper
} from '@mui/material';
import { api } from '../services/api';

const TopProductsByWeekday = ({ brandId }) => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadTopProductsByWeekday();
    }
  }, [brandId]);

  const loadTopProductsByWeekday = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/top-products-by-weekday?brand_id=${brandId}&limit=3`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar produtos mais vendidos por dia da semana');
      console.error('Error loading top products by weekday:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const getDayName = (dayAbbrev) => {
    const dayMap = {
      'Mon': 'Segunda',
      'Tue': 'Terça',
      'Wed': 'Quarta',
      'Thu': 'Quinta',
      'Fri': 'Sexta',
      'Sat': 'Sábado',
      'Sun': 'Domingo'
    };
    return dayMap[dayAbbrev] || dayAbbrev;
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

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Grid container spacing={2}>
      {days.map((day) => (
        <Grid item xs={12} sm={6} md={4} key={day}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {getDayName(day)}
            </Typography>
            {data[day] && data[day].length > 0 ? (
              <Box>
                {data[day].map((product, index) => (
                  <Box key={product.product_name} sx={{ mb: 1 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 'medium', flex: 1, mr: 1 }}>
                        {product.product_name}
                      </Typography>
                      <Chip
                        label={`#${index + 1}`}
                        size="small"
                        color={index === 0 ? 'primary' : 'default'}
                        variant={index === 0 ? 'filled' : 'outlined'}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {formatNumber(product.total_quantity)} unidades • {formatCurrency(product.total_revenue)}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Nenhum produto vendido
              </Typography>
            )}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default TopProductsByWeekday;
