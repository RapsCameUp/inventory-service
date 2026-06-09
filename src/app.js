const express = require('express');
const inventoryRoutes = require('./routes/inventory');
const { logger } = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());
app.use('/inventory', inventoryRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'inventory-service', uptime: process.uptime() });
});

app.listen(PORT, () => {
  logger.info(`inventory-service running on port ${PORT}`);
});

module.exports = app;
