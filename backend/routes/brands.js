const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Get all brands
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM brands ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching brands:', error);
    res.status(500).json({ error: 'Failed to fetch brands' });
  }
});

// Get stores by brand
router.get('/:brandId/stores', async (req, res) => {
  try {
    const { brandId } = req.params;
    const result = await db.query(
      'SELECT * FROM stores WHERE brand_id = $1 ORDER BY name',
      [brandId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ error: 'Failed to fetch stores' });
  }
});

// Get channels by brand
router.get('/:brandId/channels', async (req, res) => {
  try {
    const { brandId } = req.params;
    const result = await db.query(
      'SELECT * FROM channels WHERE brand_id = $1 ORDER BY name',
      [brandId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
  }
});

module.exports = router;
