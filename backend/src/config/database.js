import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration object
const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '1433'),
  options: {
    encrypt: true, 
    trustServerCertificate: true, 
    enableArithAbort: true,
    connectionTimeout: 45000,
    requestTimeout: 45000
  },
  pool: {
    max: 10,
    min: 0,  
    idleTimeoutMillis: 30000 
  }
};

// Connection pool instance
let poolPromise;

export const getPool = async () => {
  if (!poolPromise) {
    try {
      console.log('NEW DATABASE CONNECTION POOL | ATTEMPTING...');
      poolPromise = sql.connect(dbConfig);
      await poolPromise;
      console.log('DATABASE CONNECTION | SUCCESSFUL');
    } catch (error) {
      console.error('DATABASE CONNECTION | FAILED: ', error.message);
      poolPromise = null;
      throw error;
    }
  }
  return poolPromise;
};

export const closePool = async () => {
  if (poolPromise) {
    try {
      const pool = await poolPromise;
      await pool.close();
      console.log('DATABASE CONNECTION | CLOSED');
      poolPromise = null;
    } catch (error) {
      console.error('DATABASE CONNECTION | CLOSING ERROR!', error.message);
    }
  }
};

export default { getPool, closePool };
