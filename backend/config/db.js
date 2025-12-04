const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 2,
    idleTimeoutMillis: 30000
  },
  connectionTimeout: 30000,
  requestTimeout: 30000
};

let pool = null;

async function connectDB() {
  try {
    if (pool && pool.connected) {
      console.log('Using existing database connection');
      return pool;
    }
    
    console.log('Creating new database connection...');
    pool = await sql.connect(config);
    
    // Test connection
    await pool.request().query('SELECT 1 as test');
    console.log('Database connection established');
    
    return pool;
  } catch (err) {
    console.error('Database Connection Error:', err.message);
    throw err;
  }
} 

function getPool() {
  if (!pool) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return pool;
} 

async function closeDB() {
  if (pool) {
    await pool.close();
    pool = null;
    console.log('Database connection closed');
  }
} 

module.exports = { connectDB, sql, getPool, closeDB };
