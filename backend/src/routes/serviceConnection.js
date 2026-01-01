import express from 'express';
import {
  getAllServiceConnections,
  getServiceConnectionById,
  createServiceConnection,
  updateServiceConnection,
  deleteServiceConnection
} from '../controllers/serviceConnectionController.js';

const router = express.Router();

/**
 * Service Connection Routes
 * Base: /api/service-connections
 */

// GET /api/service-connections - Get all service connections
router.get('/', getAllServiceConnections);

// GET /api/service-connections/:id - Get service connection by ID
router.get('/:id', getServiceConnectionById);

// POST /api/service-connections - Create new service connection
router.post('/', createServiceConnection);

// PUT /api/service-connections/:id - Update service connection
router.put('/:id', updateServiceConnection);

// DELETE /api/service-connections/:id - Delete service connection
router.delete('/:id', deleteServiceConnection);

export default router;
