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
  Card,
  CardContent
} from '@mui/material';
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
import { api } from '../services/api';

const DeliveryPerformance = ({ brandId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (brandId) {
      loadDeliveryData();
    }
  }, [brandId]);

  const loadDeliveryData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics/delivery-performance?brand_id=${brandId}&group_by=day`);
      setData(response.data);
    } catch (err) {
      setError('Erro ao carregar performance de entrega');
      console.error('Error loading delivery data:', err);
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

  const formatTime = (minutes) => {
    return `${(minutes || 0).toFixed(1)} min`;
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('pt-BR').format(value || 0);
  };

  const chartData = data.map(item => ({
    ...item,
    label: item.data ? new Date(item.data).toLocaleDateString('pt-BR') : item.hora || item.semana,
    tempo_medio: parseFloat(item.tempo_medio_minutos) || 0
  }));

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Tempo Médio de Entrega
          </Typography>
          <Box height={300}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ value: 'Minutos', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  formatter={(value) => [formatTime(value), 'Tempo Médio']}
                  labelFormatter={(label) => `Data: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tempo_medio"
                  stroke="#1976d2"
                  strokeWidth={2}
                  name="Tempo Médio (min)"
                  dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Data</strong></TableCell>
              <TableCell align="right"><strong>Entregas</strong></TableCell>
              <TableCell align="right"><strong>Tempo Médio</strong></TableCell>
              <TableCell align="right"><strong>P90</strong></TableCell>
              <TableCell align="right"><strong>% Rápidas (≤30min)</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={item.data || item.hora || index} hover>
                <TableCell>
                  {item.data ? new Date(item.data).toLocaleDateString('pt-BR') : (item.hora || item.semana)}
                </TableCell>
                <TableCell align="right">
                  {formatNumber(item.total_entregas)}
                </TableCell>
                <TableCell align="right">
                  {formatTime(item.tempo_medio_minutos)}
                </TableCell>
                <TableCell align="right">
                  {formatTime(item.p90_minutos)}
                </TableCell>
                <TableCell align="right">
                  <Typography color={item.percentual_rapidas >= 80 ? 'success.main' : 'warning.main'}>
                    {formatPercentage(item.percentual_rapidas)}
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

export default DeliveryPerformance;
