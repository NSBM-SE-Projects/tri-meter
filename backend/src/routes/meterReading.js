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

const router = express.Router();

//Base URL: /api/meter-readings

// GET /api/meter-readings/meters/active - Get all active meters (must be before /:id route)
router.get('/meters/active', getActiveMeters);

// GET /api/meter-readings/latest/:meterId - Get latest reading for a meter (must be before /:id route)
router.get('/latest/:meterId', getLatestMeterReading);

// GET /api/meter-readings - Get all meter readings
router.get('/', getAllMeterReadings);

// GET /api/meter-readings/:id - Get meter reading by ID
router.get('/:id', getMeterReadingById);

// POST /api/meter-readings - Create new meter reading
router.post('/', createMeterReading);

// PUT /api/meter-readings/:id - Update meter reading
router.put('/:id', updateMeterReading);

// DELETE /api/meter-readings/:id - Delete meter reading
router.delete('/:id', deleteMeterReading);

export default router;
