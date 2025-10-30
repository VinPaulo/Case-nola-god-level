const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Listar todas as marcas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM brands ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar marcas:', error);
    res.status(500).json({ error: 'Falha ao buscar marcas' });
  }
});

// Listar todas as lojas por marca
router.get('/:brandId/stores', async (req, res) => {
  try {
    const { brandId } = req.params;
    const result = await db.query(
      'SELECT * FROM stores WHERE brand_id = $1 ORDER BY name',
      [brandId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar lojas:', error);
    res.status(500).json({ error: 'Falha ao buscar lojas' });
  }
});

// Listar todos os canais por marca
router.get('/:brandId/channels', async (req, res) => {
  try {
    const { brandId } = req.params;
    const result = await db.query(
      'SELECT * FROM channels WHERE brand_id = $1 ORDER BY name',
      [brandId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar canais:', error);
    res.status(500).json({ error: 'Falha ao buscar canais' });
  }
});

module.exports = router;
