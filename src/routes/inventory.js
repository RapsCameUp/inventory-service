const express = require('express');
const router = express.Router();
const { logger } = require('../utils/logger');
const store = require('../data/store');

router.get('/:sku', (req, res) => {
  const item = store.getItem(req.params.sku);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  res.json(item);
});

router.post('/reserve', (req, res) => {
  const { sku, quantity } = req.body;
  if (!sku || !quantity) {
    return res.status(400).json({ error: 'sku and quantity required' });
  }
  const item = store.getItem(sku);
  if (!item || item.quantity < quantity) {
    return res.status(409).json({ error: 'Insufficient stock' });
  }
  const reservationId = `RES-${Date.now()}`;
  logger.info(`Reserved ${quantity}x ${sku} → ${reservationId}`);
  res.json({ reservationId, sku, quantity, status: 'reserved' });
});

router.post('/release', (req, res) => {
  const { reservationId } = req.body;
  if (!reservationId) {
    return res.status(400).json({ error: 'reservationId required' });
  }
  logger.info(`Released reservation ${reservationId}`);
  res.json({ reservationId, status: 'released' });
});

router.put('/:sku', (req, res) => {
  const { quantity } = req.body;
  logger.info(`Updated stock for ${req.params.sku}: ${quantity}`);
  res.json({ sku: req.params.sku, quantity, lastUpdated: new Date().toISOString() });
});

module.exports = router;
