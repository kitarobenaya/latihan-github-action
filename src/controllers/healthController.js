'use strict';

/**
 * GET /health
 * Returns 200 OK with {"status": "UP"} for HAProxy liveness/readiness probe.
 */
function getHealth(req, res) {
  res.status(200).json({ status: 'UP' });
}

module.exports = { getHealth };
