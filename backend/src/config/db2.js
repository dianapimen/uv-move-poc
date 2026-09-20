const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'testdb',
  password: 'password123',
  port: 5432,
  connectionTimeoutMillis: 3000, // Máximo 3 segundos de espera
});

module.exports = {
  query: (text, params) => pool.query(text, params).then(res => res.rows),
};