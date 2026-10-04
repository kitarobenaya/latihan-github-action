'use strict';

const { register } = require('../middlewares/metrics');

/**
 * GET /metrics
 * Returns Prometheus metrics in text/plain exposition format.
 */
async function getMetrics(req, res) {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (err) {
    res.status(500).end(err.message);
  }
}

module.exports = { getMetrics };
