import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Grid,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Tabs,
  Tab
} from '@mui/material';
import {
  ExpandMore,
  PlayArrow,
  Add,
  Delete,
  FilterList,
  DateRange,
  Store,
  ShoppingCart,
  Timeline,
  BarChart,
  PieChart,
  ShowChart,
  TableChart
} from '@mui/icons-material';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { api } from '../services/api';
import DynamicChart from './DynamicChart';


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const QueryBuilder = ({ brandId }) => {
  const [metrics, setMetrics] = useState([]);
  const [dimensions, setDimensions] = useState([]);
  const [filters, setFilters] = useState({});
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Opções disponíveis
  const availableMetrics = [
    { value: 'sales', label: 'Número de Vendas', icon: <ShoppingCart /> },
    { value: 'revenue', label: 'Receita Total', icon: <Timeline /> },
    { value: 'average_ticket', label: 'Ticket Médio', icon: <BarChart /> },
    { value: 'products_sold', label: 'Produtos Vendidos', icon: <Store /> },
    { value: 'delivery_time', label: 'Tempo Médio de Entrega', icon: <Timeline /> }
  ];

  const availableDimensions = [
    { value: 'channel', label: 'Canal de Venda' },
    { value: 'store', label: 'Loja' },
    { value: 'product', label: 'Produto' },
    { value: 'weekday', label: 'Dia da Semana' },
    { value: 'hour', label: 'Hora do Dia' },
    { value: 'date', label: 'Data' }
  ];

  const availableFilters = [
    { value: 'start_date', label: 'Data Inicial', type: 'date' },
    { value: 'end_date', label: 'Data Final', type: 'date' },
    { value: 'channel_id', label: 'Canal', type: 'select' },
    { value: 'store_id', label: 'Loja', type: 'select' },
    { value: 'product_id', label: 'Produto', type: 'select' },
    { value: 'hour_range', label: 'Faixa Horária', type: 'range' }
  ];

  const [channels, setChannels] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (brandId) {
      loadOptions();
    }
  }, [brandId]);

  const loadOptions = async () => {
    try {
      const [channelsRes, storesRes, productsRes] = await Promise.all([
        api.get(`/brands/${brandId}/channels`),
        api.get(`/brands/${brandId}/stores`),
        api.get(`/analytics/top-products?brand_id=${brandId}&limit=50`)
      ]);

      setChannels(channelsRes.data);
      setStores(storesRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error('Error loading options:', err);
    }
  };

  const handleMetricChange = (metric) => {
    setMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  const handleDimensionChange = (dimension) => {
    setDimensions(prev =>
      prev.includes(dimension)
        ? prev.filter(d => d !== dimension)
        : [...prev, dimension]
    );
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const removeFilter = (filterKey) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  };

  const executeQuery = async () => {
    if (metrics.length === 0 || dimensions.length === 0) {
      setError('Selecione pelo menos uma métrica e uma dimensão');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        metrics,
        dimensions,
        filters,
        brand_id: brandId,
        limit: 100
      };

      const response = await api.post('/analytics/custom', payload);
      setResult(response.data);
      setShowPreview(true);
    } catch (err) {
      setError('Erro ao executar consulta: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const renderFilterInput = (filter) => {
    const value = filters[filter.value];

    switch (filter.type) {
      case 'date':
        return (
          <DatePicker
            selected={value ? new Date(value) : null}
            onChange={(date) => handleFilterChange(filter.value, date?.toISOString().split('T')[0])}
            dateFormat="yyyy-MM-dd"
            customInput={<TextField size="small" fullWidth />}
            placeholderText="Selecione a data"
          />
        );
      case 'select':
        let options = [];
        if (filter.value === 'channel_id') options = channels;
        else if (filter.value === 'store_id') options = stores;
        else if (filter.value === 'product_id') options = products.map(p => ({ id: p.product_name, name: p.product_name }));

        return (
          <FormControl size="small" fullWidth>
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={value || ''}
              onChange={(e) => handleFilterChange(filter.value, e.target.value)}
              label={filter.label}
            >
              {options.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'range':
        return (
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              type="number"
              placeholder="Hora inicial"
              value={value?.[0] || ''}
              onChange={(e) => handleFilterChange(filter.value, [parseInt(e.target.value) || 0, value?.[1] || 23])}
            />
            <TextField
              size="small"
              type="number"
              placeholder="Hora final"
              value={value?.[1] || ''}
              onChange={(e) => handleFilterChange(filter.value, [value?.[0] || 0, parseInt(e.target.value) || 23])}
            />
          </Box>
        );
      default:
        return (
          <TextField
            size="small"
            fullWidth
            value={value || ''}
            onChange={(e) => handleFilterChange(filter.value, e.target.value)}
            placeholder={`Digite ${filter.label.toLowerCase()}`}
          />
        );
    }
  };

  return (
    <Box>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterList />
            Construtor de Consultas Personalizadas
          </Typography>

          {/* Métricas */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Métricas (O que medir)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {availableMetrics.map(metric => (
                  <Grid item xs={12} sm={6} md={4} key={metric.value}>
                    <Chip
                      icon={metric.icon}
                      label={metric.label}
                      onClick={() => handleMetricChange(metric.value)}
                      color={metrics.includes(metric.value) ? 'primary' : 'default'}
                      variant={metrics.includes(metric.value) ? 'filled' : 'outlined'}
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Dimensões */}
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Dimensões (Como agrupar)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={1}>
                {availableDimensions.map(dimension => (
                  <Grid item xs={12} sm={6} md={4} key={dimension.value}>
                    <Chip
                      label={dimension.label}
                      onClick={() => handleDimensionChange(dimension.value)}
                      color={dimensions.includes(dimension.value) ? 'secondary' : 'default'}
                      variant={dimensions.includes(dimension.value) ? 'filled' : 'outlined'}
                      sx={{ width: '100%', justifyContent: 'flex-start' }}
                    />
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Filtros */}
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="subtitle1">Filtros (Opcional)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {availableFilters.map(filter => (
                  <Grid item xs={12} md={6} key={filter.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box flex={1}>
                        {renderFilterInput(filter)}
                      </Box>
                      {filters[filter.value] && (
                        <IconButton size="small" onClick={() => removeFilter(filter.value)}>
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </AccordionDetails>
          </Accordion>

          {/* Tipo de Gráfico */}
          <Box mt={2}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Tipo de Visualização</InputLabel>
              <Select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                label="Tipo de Visualização"
              >
                <MenuItem value="bar"><BarChart sx={{ mr: 1 }} />Barras</MenuItem>
                <MenuItem value="line"><ShowChart sx={{ mr: 1 }} />Linhas</MenuItem>
                <MenuItem value="pie"><PieChart sx={{ mr: 1 }} />Pizza</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Botão Executar */}
          <Box mt={3} display="flex" justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={executeQuery}
              disabled={loading || metrics.length === 0 || dimensions.length === 0}
              startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
            >
              {loading ? 'Executando...' : 'Gerar Visualização'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Resultado da Consulta
        </DialogTitle>
        <DialogContent>
          {result && (
            <Box>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                  <Tab icon={<BarChart />} label="Gráfico" />
                  <Tab icon={<TableChart />} label="Tabela" />
                </Tabs>
              </Box>

              <TabPanel value={activeTab} index={0}>
                <DynamicChart
                  data={result.data}
                  dimensions={result.dimensions}
                  metrics={result.metrics}
                  chartType={chartType}
                />
              </TabPanel>

              <TabPanel value={activeTab} index={1}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Query executada: {result.query}
                </Typography>

                <Typography variant="h6" gutterBottom>
                  Dados ({result.data.length} registros)
                </Typography>

                {/* Simple table preview */}
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        {result.dimensions.map(dim => (
                          <th key={dim} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>
                            {dim}
                          </th>
                        ))}
                        {result.metrics.map(metric => (
                          <th key={metric} style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>
                            {metric}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.data.slice(0, 10).map((row, index) => (
                        <tr key={index}>
                          {result.dimensions.map(dim => (
                            <td key={dim} style={{ padding: '8px', border: '1px solid #ddd' }}>
                              {row[dim]}
                            </td>
                          ))}
                          {result.metrics.map(metric => (
                            <td key={metric} style={{ padding: '8px', border: '1px solid #ddd' }}>
                              {typeof row[metric] === 'number' ? row[metric].toLocaleString('pt-BR') : row[metric]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {result.data.length > 10 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Mostrando primeiros 10 registros de {result.data.length} total
                    </Typography>
                  )}
                </Box>
              </TabPanel>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPreview(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QueryBuilder;
