const express = require('express');
const cors = require('cors');

const db = require('./config/database');
const salesRoutes = require('./routes/sales');
const analyticsRoutes = require('./routes/analytics');
const brandsRoutes = require('./routes/brands');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sales', salesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/brands', brandsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: 'Connected'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API funcionando!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Nola God Level Analytics API`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});