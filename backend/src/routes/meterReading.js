import express from 'express';
import {
  getAllMeterReadings,
  getMeterReadingById,
  createMeterReading,
  updateMeterReading,
  deleteMeterReading,
  getActiveMeters,
  getLatestMeterReading
} from '../controllers/meterReadingController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

//Base URL: /api/meter-readings

// GET /api/meter-readings/meters/active
router.get('/meters/active', verifyToken, requireRole('Admin', 'Manager', 'Field Officer'), getActiveMeters);

// GET /api/meter-readings/latest/:meterId
router.get('/latest/:meterId', verifyToken, requireRole('Admin', 'Manager', 'Field Officer'), getLatestMeterReading);

// GET /api/meter-readings
router.get('/', verifyToken, requireRole('Admin', 'Manager', 'Field Officer'), getAllMeterReadings);

// GET /api/meter-readings/:id
router.get('/:id', verifyToken, requireRole('Admin', 'Manager', 'Field Officer'), getMeterReadingById);

// POST /api/meter-readings
router.post('/', verifyToken, requireRole('Admin, Field Officer'), createMeterReading);

// PUT /api/meter-readings/:id
router.put('/:id', verifyToken, requireRole('Admin, Field Officer'), updateMeterReading);

// DELETE /api/meter-readings/:id
router.delete('/:id', verifyToken, requireRole('Admin', 'Manager'), deleteMeterReading);

export default router;
