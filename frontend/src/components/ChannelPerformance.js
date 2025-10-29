import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';
import {
  Box,
  CircularProgress,
  Alert,
  Typography,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import { api } from '../services/api';

const ChannelPerformance = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadChannelData();
    }
  }, [brandId]);

  const loadChannelData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/revenue-by-channel?brand_id=${brandId}`);
      
      const formattedData = response.data.map((item, index) => ({
        ...item,
        revenue: parseFloat(item.revenue) || 0,
        sales_count: parseInt(item.sales_count) || 0,
        average_ticket: parseFloat(item.average_ticket) || 0,
        fill: COLORS[index % COLORS.length]
      }));
      
      setData(formattedData);
    } catch (err) {
      setError('Erro ao carregar dados de canais');
      console.error('Error loading channel data:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#1976d2', '#dc004e', '#2e7d32', '#ed6c02', '#9c27b0'];

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

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Box>
      <Box height={250} mb={2}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ channel_name, revenue, percent }) => 
                `${channel_name}: ${(percent * 100).toFixed(1)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="revenue"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>
      
      <Grid container spacing={1}>
        {data.map((channel, index) => (
          <Grid item xs={12} key={channel.channel_name}>
            <Card variant="outlined" sx={{ p: 1 }}>
              <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center">
                    <Box
                      width={12}
                      height={12}
                      bgcolor={channel.fill}
                      borderRadius="50%"
                      mr={1}
                    />
                    <Typography variant="body2" fontWeight="bold">
                      {channel.channel_name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {formatCurrency(channel.revenue)}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" mt={0.5}>
                  <Typography variant="caption" color="textSecondary">
                    {formatNumber(channel.sales_count)} vendas
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Ticket: {formatCurrency(channel.average_ticket)}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ChannelPerformance;
