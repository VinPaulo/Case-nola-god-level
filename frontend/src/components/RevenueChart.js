import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
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

const RevenueChart = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadRevenueData();
    }
  }, [brandId]);

  const loadRevenueData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/revenue-by-day?brand_id=${brandId}&days=30`);
      
      const formattedData = response.data.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('pt-BR'),
        revenue: parseFloat(item.revenue) || 0,
        sales_count: parseInt(item.sales_count) || 0
      }));
      
      setData(formattedData);
    } catch (err) {
      setError('Erro ao carregar dados de receita');
      console.error('Error loading revenue data:', err);
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

  return (
    <Box sx={{ height: '100%', minHeight: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip 
            formatter={(value, name) => [
              name === 'revenue' ? formatCurrency(value) : value,
              name === 'revenue' ? 'Receita' : 'Vendas'
            ]}
            labelFormatter={(label) => `Data: ${label}`}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#1976d2" 
            strokeWidth={2}
            name="Receita"
            dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="sales_count" 
            stroke="#dc004e" 
            strokeWidth={2}
            name="Vendas"
            dot={{ fill: '#dc004e', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default RevenueChart;
