import express from 'express';
import { getPool } from '../config/database.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Tri-Meter API | RUNNING',
    timestamp: new Date().toISOString()
  });
});

// Database connection test endpoint
router.get('/test-db', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT @@VERSION AS version');

    res.status(200).json({
      status: 'OK',
      message: 'API DATABASE TEST CONNECTION | SUCCESSFUL',
      database: process.env.DB_DATABASE,
      server: process.env.DB_SERVER,
      version: result.recordset[0].version
    });
  } catch (error) {
    console.error('API DATABASE TEST CONNECTION | FAILED: ', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'API DATABASE TEST CONNECTION | FAILED',
      error: error.message
    });
  }
});

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'WELCOME TO TRI-METER API',
    version: '0.1.0',
    endpoints: {
      health: '/api/health',
      testDatabase: '/api/test-db'
    }
  });
});

export default router;
