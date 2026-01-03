import express from 'express';
import {
  getAllServiceConnections,
  getServiceConnectionById,
  createServiceConnection,
  updateServiceConnection,
  deleteServiceConnection
} from '../controllers/serviceConnectionController.js';

const router = express.Router();

// Base: /api/service-connections

// GET /api/service-connections
router.get('/', getAllServiceConnections);

// GET /api/service-connections/:id
router.get('/:id', getServiceConnectionById);

// POST /api/service-connections
router.post('/', createServiceConnection);

// PUT /api/service-connections/:id 
router.put('/:id', updateServiceConnection);

// DELETE /api/service-connections/:id
router.delete('/:id', deleteServiceConnection);

export default router;
