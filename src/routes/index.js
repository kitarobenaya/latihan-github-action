'use strict';

const { Router } = require('express');
const { getHealth } = require('../controllers/healthController');
const { getMetrics } = require('../controllers/metricsController');
const { createPayment, getTransactions } = require('../controllers/transactionController');

const router = Router();

// Observability endpoints
router.get('/health', getHealth);
router.get('/metrics', getMetrics);

// Transaction API
router.post('/api/v1/pay', createPayment);
router.get('/api/v1/transactions', getTransactions);

module.exports = router;
