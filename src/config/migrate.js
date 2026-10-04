'use strict';

const pool = require('./db');
const logger = require('./logger');

// NOTE: gen_random_uuid() is built-in from PostgreSQL 13+.
// On PostgreSQL < 13, run: CREATE EXTENSION IF NOT EXISTS pgcrypto;
const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS transactions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     VARCHAR(50)       NOT NULL,
    amount      DECIMAL(12, 2)    NOT NULL,
    currency    VARCHAR(10)       NOT NULL,
    status      VARCHAR(20)       NOT NULL DEFAULT 'SUCCESS',
    created_at  TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

async function migrate() {
  const client = await pool.connect();
  try {
    logger.info('Running migration: creating transactions table if not exists');
    await client.query(CREATE_TABLE_SQL);
    logger.info('Migration complete: transactions table is ready');
  } catch (err) {
    logger.error('Migration failed', { message: err.message, stack: err.stack });
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().then(() => process.exit(0));
