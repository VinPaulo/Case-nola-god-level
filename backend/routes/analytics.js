const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Receita por dia
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
    console.error('Erro ao buscar receita por dia:', error);
    res.status(500).json({ error: 'Falha ao buscar receita por dia' });
  }
});

// Top produtos
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
    console.error('Erro ao buscar top produtos:', error);
    res.status(500).json({ error: 'Falha ao buscar top produtos' });
  }
});

// Receita por canal
router.get('/revenue-by-channel', async (req, res) => {
  try {
    const { brand_id, limit = 5 } = req.query;
    
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
      GROUP BY ch.name
      ORDER BY revenue DESC
      LIMIT $${brand_id ? 2 : 1}
    `;
    
    params.push(parseInt(limit));
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar receita por canal:', error);
    res.status(500).json({ error: 'Falha ao buscar receita por canal' });
  }
});

// Receita por loja
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
    console.error('Erro ao buscar receita por loja:', error);
    res.status(500).json({ error: 'Falha ao buscar receita por loja' });
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

// Visão geral dos dados conforme DADOS.md (lojas, vendas, produtos vendidos, customizações, clientes)
router.get('/spec/overview', async (req, res) => {
  try {
    const { brand_id } = req.query;
    const params = [];
    let whereBrandStores = '';
    let whereBrandSales = '';
    if (brand_id) {
      whereBrandStores = ' WHERE st.brand_id = $1';
      whereBrandSales = ' LEFT JOIN stores st2 ON st2.id = s.store_id WHERE st2.brand_id = $1';
      params.push(brand_id);
    }

    const query = `
      SELECT
        (SELECT COUNT(*) FROM stores st${whereBrandStores})::int AS lojas,
        (SELECT COUNT(*) FROM sales s${whereBrandSales})::bigint AS vendas,
        (SELECT COALESCE(SUM(ps.quantity),0) FROM product_sales ps
          JOIN sales s ON s.id = ps.sale_id${brand_id ? ' JOIN stores st3 ON st3.id = s.store_id WHERE st3.brand_id = $1' : ''}
        )::bigint AS produtos_vendidos,
        (SELECT COUNT(*) FROM item_product_sales ips
          JOIN product_sales ps ON ps.id = ips.product_sale_id
          JOIN sales s ON s.id = ps.sale_id${brand_id ? ' JOIN stores st4 ON st4.id = s.store_id WHERE st4.brand_id = $1' : ''}
        )::bigint AS customizacoes,
        (SELECT COUNT(*) FROM customers)::int AS clientes
    `;

    const result = await db.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar visão geral:', error);
    res.status(500).json({ error: 'Falha ao buscar visão geral' });
  }
});

// Distribuição por canal 
router.get('/spec/channel-distribution', async (req, res) => {
  try {
    const { brand_id } = req.query;
    const params = [];
    let brandFilter = '';
    if (brand_id) {
      brandFilter = ' AND st.brand_id = $1';
      params.push(brand_id);
    }

    const query = `
      WITH base AS (
        SELECT ch.name AS canal, COUNT(*)::bigint AS vendas
        FROM sales s
        JOIN channels ch ON ch.id = s.channel_id
        LEFT JOIN stores st ON st.id = s.store_id
        WHERE s.sale_status_desc = 'COMPLETED'${brandFilter}
        GROUP BY ch.name
      ), total AS (
        SELECT SUM(vendas)::bigint AS total_vendas FROM base
      )
      SELECT canal,
             vendas,
             ROUND((vendas::numeric / NULLIF(t.total_vendas,0)) * 100.0, 2) AS percentual
      FROM base b
      JOIN total t ON true
      ORDER BY vendas DESC
      LIMIT 5
    `;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar distribuição por canal:', error);
    res.status(500).json({ error: 'Falha ao buscar distribuição por canal' });
  }
});

// Estatísticas de produtos/customizações (média de produtos por venda, % vendas com customizações)
router.get('/spec/product-stats', async (req, res) => {
  try {
    const { brand_id } = req.query;
    const params = [];
    const query = `
      WITH sales_base AS (
        SELECT s.id, s.store_id
        FROM sales s
        ${brand_id ? ' JOIN stores st ON st.id = s.store_id AND st.brand_id = $1' : ''}
        WHERE s.sale_status_desc = 'COMPLETED'
      ),
      prod AS (
        SELECT SUM(ps.quantity)::numeric AS total_produtos, COUNT(DISTINCT ps.sale_id)::numeric AS vendas_com_produtos
        FROM product_sales ps
        JOIN sales_base sb ON sb.id = ps.sale_id
      ),
      cust AS (
        SELECT COUNT(DISTINCT ps.sale_id)::numeric AS vendas_com_customizacoes
        FROM product_sales ps
        JOIN item_product_sales ips ON ips.product_sale_id = ps.id
        JOIN sales_base sb ON sb.id = ps.sale_id
      ),
      totals AS (
        SELECT COUNT(*)::numeric AS total_vendas FROM sales_base
      )
      SELECT 
        ROUND((prod.total_produtos / NULLIF(totals.total_vendas,0))::numeric, 2) AS media_produtos_por_venda,
        ROUND((cust.vendas_com_customizacoes / NULLIF(totals.total_vendas,0)) * 100.0, 2) AS percentual_vendas_com_customizacoes
      FROM prod, cust, totals
    `;
    const result = await db.query(query, brand_id ? [brand_id] : []);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar estatísticas de produtos:', error);
    res.status(500).json({ error: 'Falha ao buscar estatísticas de produtos' });
  }
});

// Estatísticas de identificação de clientes (identificados vs guest)
router.get('/spec/customer-stats', async (req, res) => {
  try {
    const { brand_id } = req.query;
    const params = [];
    let brandFilter = '';
    if (brand_id) {
      brandFilter = ' AND st.brand_id = $1';
      params.push(brand_id);
    }
    const query = `
      WITH base AS (
        SELECT s.id, s.customer_id
        FROM sales s
        LEFT JOIN stores st ON st.id = s.store_id
        WHERE s.sale_status_desc = 'COMPLETED'${brandFilter}
      )
      SELECT 
        COUNT(*)::bigint AS total_vendas,
        COUNT(*) FILTER (WHERE customer_id IS NOT NULL)::bigint AS vendas_identificadas,
        ROUND((COUNT(*) FILTER (WHERE customer_id IS NOT NULL)::numeric / NULLIF(COUNT(*),0)) * 100.0, 2) AS percentual_identificadas,
        ROUND((COUNT(*) FILTER (WHERE customer_id IS NULL)::numeric / NULLIF(COUNT(*),0)) * 100.0, 2) AS percentual_guest
      FROM base
    `;
    const result = await db.query(query, params);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar estatísticas de clientes:', error);
    res.status(500).json({ error: 'Falha ao buscar estatísticas de clientes' });
  }
});

// Distribuição semanal (Seg..Dom)
router.get('/spec/temporal/weekly', async (req, res) => {
  try {
    const { brand_id } = req.query;
    const params = [];
    let brandFilter = '';
    if (brand_id) {
      brandFilter = ' AND st.brand_id = $1';
      params.push(brand_id);
    }
    const query = `
      SELECT 
        TO_CHAR(s.created_at, 'Dy') AS dia_semana,
        EXTRACT(DOW FROM s.created_at)::int AS dia_numero,
        COUNT(*)::bigint AS vendas,
        SUM(s.total_amount)::numeric AS receita
      FROM sales s
      LEFT JOIN stores st ON st.id = s.store_id
      WHERE s.sale_status_desc = 'COMPLETED'${brandFilter}
      GROUP BY 1,2
      ORDER BY dia_numero
    `;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar dados temporais semanais:', error);
    res.status(500).json({ error: 'Falha ao buscar dados semanais' });
  }
});

// Receita mensal e crescimento mês a mês dos últimos 6 meses
router.get('/spec/temporal/monthly-growth', async (req, res) => {
  try {
    const { brand_id, months = 6 } = req.query;
    const params = [months];
    let brandFilter = '';
    if (brand_id) {
      brandFilter = ' AND st.brand_id = $2';
      params.push(brand_id);
    }
    const query = `
      WITH monthly AS (
        SELECT DATE_TRUNC('month', s.created_at) AS mes,
               SUM(s.total_amount)::numeric AS receita
        FROM sales s
        LEFT JOIN stores st ON st.id = s.store_id
        WHERE s.sale_status_desc = 'COMPLETED'
          AND s.created_at >= NOW() - (($1 || ' months')::interval)${brandFilter}
        GROUP BY 1
      ), ordered AS (
        SELECT mes, receita, 
               LAG(receita) OVER (ORDER BY mes) AS receita_anterior
        FROM monthly
      )
      SELECT to_char(mes, 'YYYY-MM') AS mes,
             receita,
             CASE WHEN receita_anterior IS NULL OR receita_anterior = 0 THEN NULL
                  ELSE ROUND(((receita - receita_anterior) / receita_anterior) * 100.0, 2)
             END AS crescimento_mes_a_mes
      FROM ordered
      ORDER BY mes
    `;
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar crescimento mensal:', error);
    res.status(500).json({ error: 'Falha ao buscar crescimento mensal' });
  }
});

// Análise de margem por produto (simulando custo baseado no preço)
router.get('/product-margins', async (req, res) => {
  try {
    const { brand_id, limit = 20 } = req.query;
    const params = [];
    let brandFilter = '';
    if (brand_id) {
      brandFilter = ' AND st.brand_id = $1';
      params.push(brand_id);
    }
    
    const query = `
      WITH product_stats AS (
        SELECT 
          p.id,
          p.name as produto,
          AVG(ps.total_price) as preco_medio,
          -- Simulando custo como 60% do preço (margem típica de restaurante)
          AVG(ps.total_price) * 0.6 as custo_estimado,
          SUM(ps.quantity) as total_vendido,
          COUNT(DISTINCT ps.sale_id) as vendas_com_produto,
          SUM(ps.total_price) as receita_total
        FROM products p
        JOIN product_sales ps ON ps.product_id = p.id
        JOIN sales s ON ps.sale_id = s.id
        LEFT JOIN stores st ON s.store_id = st.id
        WHERE s.sale_status_desc = 'COMPLETED'${brandFilter}
        GROUP BY p.id, p.name
      )
      SELECT 
        produto,
        ROUND(preco_medio::numeric, 2) as preco_medio,
        ROUND(custo_estimado::numeric, 2) as custo_estimado,
        ROUND((preco_medio - custo_estimado)::numeric, 2) as margem_unitaria,
        ROUND(((preco_medio - custo_estimado) / preco_medio * 100)::numeric, 2) as margem_percentual,
        total_vendido,
        vendas_com_produto,
        ROUND(receita_total::numeric, 2) as receita_total,
        ROUND((receita_total - (custo_estimado * total_vendido))::numeric, 2) as lucro_total
      FROM product_stats
      ORDER BY margem_percentual ASC
      LIMIT $${brand_id ? 2 : 1}
    `;
    
    params.push(parseInt(limit));
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar margens de produtos:', error);
    res.status(500).json({ error: 'Falha ao buscar margens de produtos' });
  }
});

// Performance de entrega por período
router.get('/delivery-performance', async (req, res) => {
  try {
    const { brand_id, days = 30, group_by = 'day' } = req.query;
    const params = [];
    let brandFilter = '';
    if (brand_id) {
      brandFilter = ' AND st.brand_id = $1';
      params.push(brand_id);
    }
    
    let groupClause = '';
    let selectClause = '';
    
    if (group_by === 'hour') {
      groupClause = 'EXTRACT(HOUR FROM s.created_at)';
      selectClause = 'EXTRACT(HOUR FROM s.created_at) as hora,';
    } else if (group_by === 'day') {
      groupClause = 'DATE(s.created_at)';
      selectClause = 'DATE(s.created_at) as data,';
    } else if (group_by === 'week') {
      groupClause = 'DATE_TRUNC(\'week\', s.created_at)';
      selectClause = 'DATE_TRUNC(\'week\', s.created_at) as semana,';
    }
    
    const query = `
      SELECT 
        ${selectClause}
        COUNT(*) as total_entregas,
        ROUND(AVG(s.delivery_seconds / 60.0)::numeric, 2) as tempo_medio_minutos,
        ROUND(MIN(s.delivery_seconds / 60.0)::numeric, 2) as tempo_minimo_minutos,
        ROUND(MAX(s.delivery_seconds / 60.0)::numeric, 2) as tempo_maximo_minutos,
        ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY s.delivery_seconds / 60.0)::numeric, 2) as mediana_minutos,
        ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY s.delivery_seconds / 60.0)::numeric, 2) as p90_minutos,
        COUNT(*) FILTER (WHERE s.delivery_seconds / 60.0 <= 30) as entregas_rapidas,
        ROUND((COUNT(*) FILTER (WHERE s.delivery_seconds / 60.0 <= 30)::numeric / COUNT(*)) * 100, 2) as percentual_rapidas
      FROM sales s
      LEFT JOIN stores st ON s.store_id = st.id
      WHERE s.sale_status_desc = 'COMPLETED'
        AND s.delivery_seconds IS NOT NULL
        AND s.created_at >= NOW() - INTERVAL '${days} days'${brandFilter}
      GROUP BY ${groupClause}
      ORDER BY ${groupClause}
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar performance de entrega:', error);
    res.status(500).json({ error: 'Falha ao buscar performance de entrega' });
  }
});

// Análise de retenção de clientes
router.get('/customer-retention', async (req, res) => {
  try {
    const { brand_id, days_inactive = 30, min_purchases = 3, limit = 10 } = req.query;
    const params = [];
    let brandFilter = '';
    if (brand_id) {
      brandFilter = ' AND st.brand_id = $1';
      params.push(brand_id);
    }
    
    const query = `
      WITH customer_stats AS (
        SELECT 
          c.id,
          c.customer_name,
          c.email,
          COUNT(DISTINCT s.id) as total_compras,
          SUM(s.total_amount) as valor_total_gasto,
          AVG(s.total_amount) as ticket_medio,
          MIN(s.created_at) as primeira_compra,
          MAX(s.created_at) as ultima_compra,
          EXTRACT(DAYS FROM (NOW() - MAX(s.created_at))) as dias_desde_ultima_compra
        FROM customers c
        JOIN sales s ON s.customer_id = c.id
        LEFT JOIN stores st ON s.store_id = st.id
        WHERE s.sale_status_desc = 'COMPLETED'${brandFilter}
        GROUP BY c.id, c.customer_name, c.email
      )
      SELECT 
        customer_name,
        email,
        total_compras,
        ROUND(valor_total_gasto::numeric, 2) as valor_total_gasto,
        ROUND(ticket_medio::numeric, 2) as ticket_medio,
        primeira_compra,
        ultima_compra,
        dias_desde_ultima_compra,
        CASE 
          WHEN dias_desde_ultima_compra <= ${days_inactive} THEN 'Ativo'
          WHEN dias_desde_ultima_compra <= ${days_inactive * 2} THEN 'Em risco'
          ELSE 'Inativo'
        END as status_retencao,
        CASE 
          WHEN total_compras >= ${min_purchases} AND dias_desde_ultima_compra > ${days_inactive} THEN 'Alerta: Cliente valioso inativo'
          WHEN total_compras >= ${min_purchases} AND dias_desde_ultima_compra <= ${days_inactive} THEN 'Cliente valioso ativo'
          ELSE 'Cliente regular'
        END as categoria_cliente
      FROM customer_stats
      WHERE total_compras >= ${min_purchases}
      ORDER BY total_compras DESC, valor_total_gasto DESC
      LIMIT $${params.length + 1}
    `;
    
    params.push(parseInt(limit));
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar retenção de clientes:', error);
    res.status(500).json({ error: 'Falha ao buscar retenção de clientes' });
  }
});

// Detecção de anomalias
router.get('/anomalies', async (req, res) => {
  try {
    const { brand_id, days = 30 } = req.query;
    const params = [];
    let brandFilter = '';
    if (brand_id) {
      brandFilter = ' AND st.brand_id = $1';
      params.push(brand_id);
    }
    
    const query = `
      WITH daily_stats AS (
        SELECT 
          DATE(s.created_at) as data,
          COUNT(*) as vendas,
          SUM(s.total_amount) as receita,
          AVG(s.total_amount) as ticket_medio
        FROM sales s
        LEFT JOIN stores st ON s.store_id = st.id
        WHERE s.sale_status_desc = 'COMPLETED'
          AND s.created_at >= NOW() - INTERVAL '${days} days'${brandFilter}
        GROUP BY DATE(s.created_at)
      ),
      stats_with_avg AS (
        SELECT 
          *,
          AVG(vendas) OVER (ORDER BY data ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as media_vendas_7d,
          AVG(receita) OVER (ORDER BY data ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as media_receita_7d,
          STDDEV(vendas) OVER (ORDER BY data ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as desvio_vendas_7d,
          STDDEV(receita) OVER (ORDER BY data ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) as desvio_receita_7d
        FROM daily_stats
      )
      SELECT 
        data,
        vendas,
        ROUND(receita::numeric, 2) as receita,
        ROUND(ticket_medio::numeric, 2) as ticket_medio,
        ROUND(media_vendas_7d::numeric, 2) as media_vendas_7d,
        ROUND(media_receita_7d::numeric, 2) as media_receita_7d,
        CASE 
          WHEN vendas < (media_vendas_7d - 2 * desvio_vendas_7d) THEN 'Queda significativa em vendas'
          WHEN vendas > (media_vendas_7d + 2 * desvio_vendas_7d) THEN 'Pico significativo em vendas'
          WHEN receita < (media_receita_7d - 2 * desvio_receita_7d) THEN 'Queda significativa em receita'
          WHEN receita > (media_receita_7d + 2 * desvio_receita_7d) THEN 'Pico significativo em receita'
          ELSE 'Normal'
        END as anomalia,
        ROUND(((vendas - media_vendas_7d) / media_vendas_7d * 100)::numeric, 2) as variacao_vendas_pct,
        ROUND(((receita - media_receita_7d) / media_receita_7d * 100)::numeric, 2) as variacao_receita_pct
      FROM stats_with_avg
      WHERE data >= NOW() - INTERVAL '${days} days'
        AND (
          vendas < (media_vendas_7d - 2 * desvio_vendas_7d) OR
          vendas > (media_vendas_7d + 2 * desvio_vendas_7d) OR
          receita < (media_receita_7d - 2 * desvio_receita_7d) OR
          receita > (media_receita_7d + 2 * desvio_receita_7d)
        )
      ORDER BY data DESC
    `;
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar anomalias:', error);
    res.status(500).json({ error: 'Falha ao buscar anomalias' });
  }
});

// Top produtos por dia da semana
router.get('/top-products-by-weekday', async (req, res) => {
  try {
    const { brand_id, limit = 5 } = req.query;
    
    let query = `
      SELECT 
        TO_CHAR(s.created_at, 'Dy') AS dia_semana,
        EXTRACT(DOW FROM s.created_at)::int AS dia_numero,
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
      GROUP BY TO_CHAR(s.created_at, 'Dy'), EXTRACT(DOW FROM s.created_at), p.id, p.name
      ORDER BY dia_numero, total_revenue DESC
    `;
    
    const result = await db.query(query, params);
    
    // Agrupar por dia da semana e pegar os top produtos de cada dia
    const groupedByDay = {};
    result.rows.forEach(row => {
      if (!groupedByDay[row.dia_semana]) {
        groupedByDay[row.dia_semana] = [];
      }
      if (groupedByDay[row.dia_semana].length < limit) {
        groupedByDay[row.dia_semana].push({
          product_name: row.product_name,
          total_quantity: parseInt(row.total_quantity),
          total_revenue: parseFloat(row.total_revenue),
          sales_count: parseInt(row.sales_count)
        });
      }
    });
    
    res.json(groupedByDay);
  } catch (error) {
    console.error('Erro ao buscar top produtos por dia da semana:', error);
    res.status(500).json({ error: 'Falha ao buscar top produtos por dia da semana' });
  }
});

module.exports = router;
