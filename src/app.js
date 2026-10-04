'use strict';

const express = require('express');
const env = require('./config/env');
const logger = require('./config/logger');
const { metricsMiddleware } = require('./middlewares/metrics');
const router = require('./routes/index');

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Prometheus metrics middleware — must be registered before routes
app.use(metricsMiddleware);

// Routes
app.use('/', router);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(env.port, () => {
  logger.info(`PayCore API running on port ${env.port}`, { port: env.port, env: env.nodeEnv });
});

module.exports = app;
