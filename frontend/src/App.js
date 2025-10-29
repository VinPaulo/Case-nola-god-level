import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  TrendingUp,
  Store,
  ShoppingCart,
  AttachMoney,
  Timeline,
  BarChart
} from '@mui/icons-material';

import RevenueChart from './components/RevenueChart';
import TopProducts from './components/TopProducts';
import ChannelPerformance from './components/ChannelPerformance';
import StorePerformance from './components/StorePerformance';
import HourlyDistribution from './components/HourlyDistribution';
import SalesSummary from './components/SalesSummary';
import { api } from './services/api';

function App() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      const response = await api.get('/brands');
      setBrands(response.data);
      if (response.data.length > 0) {
        setSelectedBrand(response.data[0].id.toString());
      }
    } catch (err) {
      setError('Erro ao carregar marcas');
      console.error('Error loading brands:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <TrendingUp sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Nola God Level - Analytics Dashboard
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Marca</InputLabel>
            <Select
              value={selectedBrand}
              onChange={handleBrandChange}
              label="Marca"
              sx={{ color: 'white' }}
            >
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id.toString()}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<BarChart />} label="Visão Geral" />
            <Tab icon={<Timeline />} label="Tendências" />
            <Tab icon={<Store />} label="Lojas" />
            <Tab icon={<ShoppingCart />} label="Produtos" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SalesSummary brandId={selectedBrand} />
            </Grid>
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Receita por Dia
                  </Typography>
                  <RevenueChart brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance por Canal
                  </Typography>
                  <ChannelPerformance brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribuição por Horário
                  </Typography>
                  <HourlyDistribution brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Receita por Canal
                  </Typography>
                  <ChannelPerformance brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance das Lojas
                  </Typography>
                  <StorePerformance brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Produtos Mais Vendidos
                  </Typography>
                  <TopProducts brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default App;
