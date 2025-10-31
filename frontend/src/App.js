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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  IconButton,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  TrendingUp,
  Store,
  ShoppingCart,
  Timeline,
  BarChart,
  Brightness4,
  Brightness7
} from '@mui/icons-material';

import RevenueChart from './components/RevenueChart';
import TopProducts from './components/TopProducts';
import ChannelPerformance from './components/ChannelPerformance';
import StorePerformance from './components/StorePerformance';
import HourlyDistribution from './components/HourlyDistribution';
import SalesSummary from './components/SalesSummary';
import TopProductsByWeekday from './components/TopProductsByWeekday';
import QueryBuilder from './components/QueryBuilder';
import Anomalies from './components/Anomalies';
import CustomerRetention from './components/CustomerRetention';
import DeliveryPerformance from './components/DeliveryPerformance';
import ProductMargins from './components/ProductMargins';
import { api } from './services/api';

function App() {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#121212' : '#f5f5f5',
      },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
      h4: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
    },
  });

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

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
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
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, backgroundColor: 'background.default', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ mb: 3 }}>
          <Toolbar>
            <TrendingUp sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Nola God Level - Painel de Análises
            </Typography>
            <IconButton color="inherit" onClick={handleThemeToggle}>
              {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200, ml: 2 }}>
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

      <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab icon={<BarChart />} label="Visão Geral" />
            <Tab icon={<Timeline />} label="Tendências" />
            <Tab icon={<Store />} label="Lojas" />
            <Tab icon={<ShoppingCart />} label="Produtos" />
            <Tab icon={<TrendingUp />} label="Análises Avançadas" />
            <Tab icon={<BarChart />} label="Consultas Personalizadas" />
          </Tabs>
        </Box>

        {/* --- VISÃO GERAL --- */}
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <SalesSummary brandId={selectedBrand} />
            </Grid>

            {/* Receita por Dia */}
            <Grid item xs={12} md={8}>
              <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0 }}>
                  <Box sx={{ p: 3, pb: 0 }}>
                    <Typography variant="h6" gutterBottom>
                      Receita por Dia
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, pt: 0 }}>
                    <RevenueChart brandId={selectedBrand} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Performance por Canal */}
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance por Canal
                  </Typography>
                  <ChannelPerformance brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>

            {/* Top Produtos por Dia da Semana */}
            <Grid item xs={12}>
              <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Top Produtos por Dia da Semana
                  </Typography>
                  <TopProductsByWeekday brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* --- TENDÊNCIAS --- */}
        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0 }}>
                  <Box sx={{ p: 3, pb: 0 }}>
                    <Typography variant="h6" gutterBottom>
                      Distribuição por Horário
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, pt: 0 }}>
                    <HourlyDistribution brandId={selectedBrand} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%', boxShadow: 3, borderRadius: 2 }}>
                <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 0 }}>
                  <Box sx={{ p: 3, pb: 0 }}>
                    <Typography variant="h6" gutterBottom>
                      Receita por Canal
                    </Typography>
                  </Box>
                  <Box sx={{ flex: 1, p: 3, pt: 0 }}>
                    <ChannelPerformance brandId={selectedBrand} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* --- LOJAS --- */}
        {tabValue === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
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

        {/* --- PRODUTOS --- */}
        {tabValue === 3 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
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

        {/* --- ANÁLISES AVANÇADAS --- */}
        {tabValue === 4 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Detecção de Anomalias
                  </Typography>
                  <Anomalies brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Retenção de Clientes
                  </Typography>
                  <CustomerRetention brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Performance de Entrega
                  </Typography>
                  <DeliveryPerformance brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Margens de Produtos
                  </Typography>
                  <ProductMargins brandId={selectedBrand} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* --- CONSULTAS PERSONALIZADAS --- */}
        {tabValue === 5 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <QueryBuilder brandId={selectedBrand} />
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
    </ThemeProvider>
  );
}

export default App;
