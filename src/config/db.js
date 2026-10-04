'use strict';

// NOTE: gen_random_uuid() is built-in from PostgreSQL 13+.
// On PostgreSQL < 13, enable the pgcrypto extension first:
//   CREATE EXTENSION IF NOT EXISTS pgcrypto;

const { Pool } = require('pg');
const env = require('./env');
const logger = require('./logger');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  user: env.db.user,
  password: env.db.password,
  database: env.db.database,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('PostgreSQL pool: new client connected', { db: env.db.database });
});

pool.on('error', (err) => {
  logger.error('PostgreSQL pool: idle client error', {
    message: err.message,
    stack: err.stack,
  });
});

module.exports = pool;
