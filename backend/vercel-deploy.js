const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Configuração do banco PostgreSQL (Railway, Supabase, etc.)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT id, email, password_hash, role FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/brands', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name FROM brands ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Brands error:', error);
    res.status(500).json({ error: 'Erro ao buscar marcas' });
  }
});

app.get('/api/analytics/alerts', authenticateToken, async (req, res) => {
  try {
    const { brand_id, role } = req.query;

    // Lógica simplificada de alertas - em produção, implemente regras de negócio
    const alerts = [
      {
        type: 'warning',
        severity: 'medium',
        message: 'Queda de 8% nas vendas da última semana',
        details: 'Comparado com a semana anterior'
      },
      {
        type: 'info',
        severity: 'low',
        message: 'Aumento de 15% no ticket médio',
        details: 'Melhoria no último mês'
      }
    ];

    // Filtrar por role se necessário
    const filteredAlerts = role === 'socio' ? alerts : alerts.slice(0, 1);

    res.json(filteredAlerts);
  } catch (error) {
    console.error('Alerts error:', error);
    res.status(500).json({ error: 'Erro ao buscar alertas' });
  }
});

// Sales summary
app.get('/api/sales/summary', authenticateToken, async (req, res) => {
  try {
    const { brand_id } = req.query;

    const result = await pool.query(`
      SELECT
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_ticket,
        SUM(delivery_fee) as total_delivery_fees
      FROM sales
      WHERE brand_id = $1
      AND created_at >= CURRENT_DATE - INTERVAL '30 days'
    `, [brand_id]);

    res.json(result.rows[0] || {
      total_sales: 0,
      total_revenue: 0,
      average_ticket: 0,
      total_delivery_fees: 0
    });
  } catch (error) {
    console.error('Sales summary error:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo de vendas' });
  }
});

// Revenue by day
app.get('/api/analytics/revenue-by-day', authenticateToken, async (req, res) => {
  try {
    const { brand_id, days = 30 } = req.query;

    const result = await pool.query(`
      SELECT
        DATE(created_at) as date,
        COUNT(*) as sales_count,
        SUM(total_amount) as revenue
      FROM sales
      WHERE brand_id = $1
      AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `, [brand_id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Revenue by day error:', error);
    res.status(500).json({ error: 'Erro ao buscar receita por dia' });
  }
});

// Top products
app.get('/api/analytics/top-products', authenticateToken, async (req, res) => {
  try {
    const { brand_id, limit = 10 } = req.query;

    const result = await pool.query(`
      SELECT
        p.product_name,
        COUNT(si.id) as sales_count,
        SUM(si.quantity) as total_quantity,
        SUM(si.total_price) as total_revenue
      FROM sales_items si
      JOIN products p ON si.product_id = p.id
      JOIN sales s ON si.sale_id = s.id
      WHERE s.brand_id = $1
      AND s.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY p.id, p.product_name
      ORDER BY total_revenue DESC
      LIMIT $2
    `, [brand_id, limit]);

    res.json(result.rows);
  } catch (error) {
    console.error('Top products error:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos mais vendidos' });
  }
});

// Revenue by channel
app.get('/api/analytics/revenue-by-channel', authenticateToken, async (req, res) => {
  try {
    const { brand_id } = req.query;

    const result = await pool.query(`
      SELECT
        c.name as channel_name,
        COUNT(s.id) as sales_count,
        SUM(s.total_amount) as revenue,
        AVG(s.total_amount) as average_ticket
      FROM sales s
      JOIN channels c ON s.channel_id = c.id
      WHERE s.brand_id = $1
      AND s.created_at >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
    `, [brand_id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Revenue by channel error:', error);
    res.status(500).json({ error: 'Erro ao buscar receita por canal' });
  }
});

// Custom analytics query
app.post('/api/analytics/custom', authenticateToken, async (req, res) => {
  try {
    const { metrics, dimensions, filters, brand_id, limit = 100 } = req.body;

    // Construir query dinamicamente (simplificada)
    let selectParts = [];
    let groupBy = [];
    let whereConditions = ['s.brand_id = $1'];
    let params = [brand_id];
    let paramIndex = 2;

    // Métricas
    if (metrics.includes('sales')) selectParts.push('COUNT(s.id) as sales');
    if (metrics.includes('revenue')) selectParts.push('SUM(s.total_amount) as revenue');
    if (metrics.includes('average_ticket')) selectParts.push('AVG(s.total_amount) as average_ticket');

    // Dimensões
    if (dimensions.includes('channel')) {
      selectParts.push('c.name as channel');
      groupBy.push('c.id, c.name');
    }
    if (dimensions.includes('store')) {
      selectParts.push('st.name as store');
      groupBy.push('st.id, st.name');
    }
    if (dimensions.includes('date')) {
      selectParts.push('DATE(s.created_at) as date');
      groupBy.push('DATE(s.created_at)');
    }

    // Filtros
    if (filters.start_date) {
      whereConditions.push(`s.created_at >= $${paramIndex}`);
      params.push(filters.start_date);
      paramIndex++;
    }
    if (filters.end_date) {
      whereConditions.push(`s.created_at <= $${paramIndex}`);
      params.push(filters.end_date);
      paramIndex++;
    }

    const query = `
      SELECT ${selectParts.join(', ')}
      FROM sales s
      LEFT JOIN channels c ON s.channel_id = c.id
      LEFT JOIN stores st ON s.store_id = st.id
      WHERE ${whereConditions.join(' AND ')}
      ${groupBy.length > 0 ? 'GROUP BY ' + groupBy.join(', ') : ''}
      ORDER BY ${metrics.includes('revenue') ? 'revenue DESC' : 'sales DESC'}
      LIMIT $${paramIndex}
    `;
    params.push(limit);

    const result = await pool.query(query, params);

    res.json({
      data: result.rows,
      dimensions,
      metrics,
      query: query.replace(/\$\d+/g, '?')
    });
  } catch (error) {
    console.error('Custom analytics error:', error);
    res.status(500).json({ error: 'Erro ao executar consulta personalizada' });
  }
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

module.exports = app;
