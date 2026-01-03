import express from 'express';
import {
  getAllTariffs,
  getTariffById,
  createTariff,
  updateTariff,
  deleteTariff
} from '../controllers/tariffController.js';

const router = express.Router();

/**
 * Tariff Routes
 * Base: /api/tariffs
 */

// GET /api/tariffs - Get all tariffs with optional filters
router.get('/', getAllTariffs);

// GET /api/tariffs/:id - Get tariff by ID
router.get('/:id', getTariffById);

// POST /api/tariffs - Create new tariff
router.post('/', createTariff);

// PUT /api/tariffs/:id - Update tariff
router.put('/:id', updateTariff);

// DELETE /api/tariffs/:id - Delete tariff
router.delete('/:id', deleteTariff);

export default router;
