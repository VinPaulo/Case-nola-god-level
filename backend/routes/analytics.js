const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Revenue by day
router.get('/revenue-by-day', async (req, res) => {
  try {
    const { brand_id, days = 30 } = req.query;
    
    let query = `
      SELECT 
        DATE(s.created_at) as date,
        SUM(s.total_amount) as revenue,
        COUNT(*) as sales_count
      FROM sales s
      LEFT JOIN stores st ON s.store_id = st.id
      WHERE s.sale_status_desc = 'COMPLETED'
        AND s.created_at >= NOW() - INTERVAL '${days} days'
    `;
    
    const params = [];
    if (brand_id) {
      query += ` AND st.brand_id = $1`;
      params.push(brand_id);
    }
    
    query += `
      GROUP BY DATE(s.created_at)
      ORDER BY date ASC
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching revenue by day:', error);
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

// Top products
router.get('/top-products', async (req, res) => {
  try {
    const { brand_id, limit = 10 } = req.query;
    
    let query = `
      SELECT 
        p.name as product_name,
        SUM(ps.quantity) as total_quantity,
        SUM(ps.total_price) as total_revenue,
        COUNT(DISTINCT ps.sale_id) as sales_count
      FROM product_sales ps
      JOIN products p ON ps.product_id = p.id
      JOIN sales s ON ps.sale_id = s.id
      LEFT JOIN stores st ON s.store_id = st.id
      WHERE s.sale_status_desc = 'COMPLETED'
    `;
    
    const params = [];
    if (brand_id) {
      query += ` AND st.brand_id = $1`;
      params.push(brand_id);
    }
    
    query += `
      GROUP BY p.id, p.name
      ORDER BY total_revenue DESC
      LIMIT $${brand_id ? 2 : 1}
    `;
    
    if (brand_id) {
      params.push(limit);
    } else {
      params.push(limit);
    }
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching top products:', error);
    res.status(500).json({ error: 'Failed to fetch top products' });
  }
});

// Revenue by channel
router.get('/revenue-by-channel', async (req, res) => {
  try {
    const { brand_id } = req.query;
    
    let query = `
      SELECT 
        ch.name as channel_name,
        SUM(s.total_amount) as revenue,
        COUNT(*) as sales_count,
        AVG(s.total_amount) as average_ticket
      FROM sales s
      JOIN channels ch ON s.channel_id = ch.id
      LEFT JOIN stores st ON s.store_id = st.id
      WHERE s.sale_status_desc = 'COMPLETED'
    `;
    
    const params = [];
    if (brand_id) {
      query += ` AND st.brand_id = $1`;
      params.push(brand_id);
    }
    
    query += `
      GROUP BY ch.id, ch.name
      ORDER BY revenue DESC
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching revenue by channel:', error);
    res.status(500).json({ error: 'Failed to fetch channel data' });
  }
});

// Revenue by store
router.get('/revenue-by-store', async (req, res) => {
  try {
    const { brand_id, limit = 20 } = req.query;
    
    let query = `
      SELECT 
        st.name as store_name,
        st.city,
        st.state,
        SUM(s.total_amount) as revenue,
        COUNT(*) as sales_count,
        AVG(s.total_amount) as average_ticket
      FROM sales s
      JOIN stores st ON s.store_id = st.id
      WHERE s.sale_status_desc = 'COMPLETED'
    `;
    
    const params = [];
    if (brand_id) {
      query += ` AND st.brand_id = $1`;
      params.push(brand_id);
    }
    
    query += `
      GROUP BY st.id, st.name, st.city, st.state
      ORDER BY revenue DESC
      LIMIT $${brand_id ? 2 : 1}
    `;
    
    if (brand_id) {
      params.push(limit);
    } else {
      params.push(limit);
    }
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching revenue by store:', error);
    res.status(500).json({ error: 'Failed to fetch store data' });
  }
});

// Hourly sales distribution
router.get('/hourly-distribution', async (req, res) => {
  try {
    const { brand_id } = req.query;
    
    let query = `
      SELECT 
        EXTRACT(HOUR FROM s.created_at) as hour,
        COUNT(*) as sales_count,
        SUM(s.total_amount) as revenue
      FROM sales s
      LEFT JOIN stores st ON s.store_id = st.id
      WHERE s.sale_status_desc = 'COMPLETED'
    `;
    
    const params = [];
    if (brand_id) {
      query += ` AND st.brand_id = $1`;
      params.push(brand_id);
    }
    
    query += `
      GROUP BY EXTRACT(HOUR FROM s.created_at)
      ORDER BY hour ASC
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching hourly distribution:', error);
    res.status(500).json({ error: 'Failed to fetch hourly data' });
  }
});

// Performance by Maria's stores specifically
router.get('/maria-stores', async (req, res) => {
  try {
    const { brand_id } = req.query;
    
    let query = `
      SELECT 
        st.id as store_id,
        st.name as store_name,
        st.city,
        st.state,
        COUNT(s.id) as sales_count,
        COALESCE(SUM(s.total_amount), 0) as revenue,
        COALESCE(AVG(s.total_amount), 0) as average_ticket
      FROM stores st
      LEFT JOIN sales s ON st.id = s.store_id AND s.sale_status_desc = 'COMPLETED'
      WHERE st.brand_id = $1 AND st.name LIKE '%Maria%'
      GROUP BY st.id, st.name, st.city, st.state
      ORDER BY revenue DESC
    `;
    
    const result = await db.query(query, [brand_id]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching Maria stores:', error);
    res.status(500).json({ error: 'Failed to fetch Maria stores data' });
  }
});

module.exports = router;
