'use strict';

const pool = require('../config/db');
const logger = require('../config/logger');

/**
 * POST /api/v1/pay
 * Body: { user_id: string, amount: number, currency: string }
 */
async function createPayment(req, res, next) {
  try {
    const { user_id, amount, currency } = req.body;

    // Input validation
    if (!user_id || typeof user_id !== 'string' || user_id.trim() === '') {
      return res.status(400).json({ error: 'user_id is required and must be a non-empty string' });
    }
    if (amount === undefined || amount === null || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'amount is required and must be a positive number' });
    }
    if (!currency || typeof currency !== 'string' || currency.trim() === '') {
      return res.status(400).json({ error: 'currency is required and must be a non-empty string' });
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, amount, currency, status)
       VALUES ($1, $2, $3, 'SUCCESS')
       RETURNING id, status`,
      [user_id.trim(), amount, currency.trim().toUpperCase()]
    );

    const { id: transaction_id, status } = result.rows[0];

    logger.info('Payment created', {
      transaction_id,
      user_id: user_id.trim(),
      amount,
      currency: currency.trim().toUpperCase(),
      status,
    });

    return res.status(201).json({ transaction_id, status });
  } catch (err) {
    logger.error('Failed to create payment', { message: err.message, stack: err.stack });
    return next(err);
  }
}

/**
 * GET /api/v1/transactions
 * Returns latest 100 transactions ordered by created_at DESC.
 */
async function getTransactions(req, res, next) {
  try {
    const result = await pool.query(
      `SELECT id, user_id, amount, currency, status, created_at
       FROM transactions
       ORDER BY created_at DESC
       LIMIT 100`
    );

    logger.info('Transactions fetched', { count: result.rows.length });

    return res.status(200).json({ transactions: result.rows });
  } catch (err) {
    logger.error('Failed to fetch transactions', { message: err.message, stack: err.stack });
    return next(err);
  }
}

module.exports = { createPayment, getTransactions };
