// db.js
const { Pool } = require('pg');

const pool = new Pool({
  // configure via environment variables or hard-code for local dev
  user: process.env.PGUSER || 'postgres',
  host: process.env.PGHOST || 'localhost',
  database: process.env.PGDATABASE || 'flightdb',
  password: process.env.PGPASSWORD || 'postgres',
  port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
  max: 10,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
};
