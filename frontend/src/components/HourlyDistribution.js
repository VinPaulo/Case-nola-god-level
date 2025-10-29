import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  Box,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import { api } from '../services/api';

const HourlyDistribution = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadHourlyData();
    }
  }, [brandId]);

  const loadHourlyData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/hourly-distribution?brand_id=${brandId}`);
      
      // Create array with all 24 hours, filling missing hours with 0
      const hourlyData = Array.from({ length: 24 }, (_, index) => {
        const existingData = response.data.find(item => parseInt(item.hour) === index);
        return {
          hour: `${index.toString().padStart(2, '0')}:00`,
          sales_count: existingData ? parseInt(existingData.sales_count) : 0,
          revenue: existingData ? parseFloat(existingData.revenue) : 0
        };
      });
      
      setData(hourlyData);
    } catch (err) {
      setError('Erro ao carregar distribuição horária');
      console.error('Error loading hourly data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={300}>
        <Typography color="textSecondary">Nenhum dado disponível</Typography>
      </Box>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <Box height={400}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="hour" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            yAxisId="left"
          />
          <YAxis 
            orientation="right" 
            tick={{ fontSize: 12 }}
            yAxisId="right"
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'revenue' ? formatCurrency(value) : formatNumber(value),
              name === 'revenue' ? 'Receita' : 'Vendas'
            ]}
            labelFormatter={(label) => `Horário: ${label}`}
          />
          <Legend />
          <Bar 
            yAxisId="left"
            dataKey="sales_count" 
            fill="#1976d2" 
            name="Vendas"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            yAxisId="right"
            dataKey="revenue" 
            fill="#dc004e" 
            name="Receita"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default HourlyDistribution;
