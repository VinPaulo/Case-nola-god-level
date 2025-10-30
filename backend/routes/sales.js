const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Listar todas as vendas com paginação
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 50, brand_id, store_id, channel_id } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT 
        s.*,
        st.name as store_name,
        ch.name as channel_name,
        b.name as brand_name
      FROM sales s
      LEFT JOIN stores st ON s.store_id = st.id
      LEFT JOIN channels ch ON s.channel_id = ch.id
      LEFT JOIN brands b ON st.brand_id = b.id
      WHERE 1=1
    `;
    
    const params = [];
    let paramCount = 1;
    
    if (brand_id) {
      query += ` AND st.brand_id = $${paramCount}`;
      params.push(brand_id);
      paramCount++;
    }
    
    if (store_id) {
      query += ` AND s.store_id = $${paramCount}`;
      params.push(store_id);
      paramCount++;
    }
    
    if (channel_id) {
      query += ` AND s.channel_id = $${paramCount}`;
      params.push(channel_id);
      paramCount++;
    }
    
    query += ` ORDER BY s.created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    // Contar todas as vendas
    let countQuery = `
      SELECT COUNT(*) as total
      FROM sales s
      LEFT JOIN stores st ON s.store_id = st.id
      WHERE 1=1
    `;
    
    const countParams = [];
    let countParamCount = 1;
    
    if (brand_id) {
      countQuery += ` AND st.brand_id = $${countParamCount}`;
      countParams.push(brand_id);
      countParamCount++;
    }
    
    if (store_id) {
      countQuery += ` AND s.store_id = $${countParamCount}`;
      countParams.push(store_id);
      countParamCount++;
    }
    
    if (channel_id) {
      countQuery += ` AND s.channel_id = $${countParamCount}`;
      countParams.push(channel_id);
      countParamCount++;
    }
    
    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);
    
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao buscar vendas:', error);
    res.status(500).json({ error: 'Falha ao buscar vendas' });
  }
});

// Resumo das vendas
router.get('/summary', async (req, res) => {
  try {
    const { brand_id, start_date, end_date } = req.query;
    
    let query = `
      SELECT 
        COUNT(*) as total_sales,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as average_ticket,
        SUM(total_discount) as total_discounts,
        SUM(delivery_fee) as total_delivery_fees,
        (SELECT COUNT(*) FROM stores WHERE brand_id = $1 AND name LIKE '%Maria%') as total_stores
      FROM sales s
      LEFT JOIN stores st ON s.store_id = st.id
      WHERE s.sale_status_desc = 'COMPLETED'
    `;
    
    const params = [brand_id || 1]; // Brand_id padrão é 1
    let paramCount = 2; // Começar do 2 pois $1 já é usado na subconsulta
    
    if (brand_id) {
      query += ` AND st.brand_id = $${paramCount}`;
      params.push(brand_id);
      paramCount++;
    }
    
    if (start_date) {
      query += ` AND s.created_at >= $${paramCount}`;
      params.push(start_date);
      paramCount++;
    }
    
    if (end_date) {
      query += ` AND s.created_at <= $${paramCount}`;
      params.push(end_date);
      paramCount++;
    }
    
    const result = await db.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar resumo das vendas:', error);
    res.status(500).json({ error: 'Falha ao buscar resumo das vendas' });
  }
});

module.exports = router;
