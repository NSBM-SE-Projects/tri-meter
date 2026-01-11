import express from 'express';
import {
  getAllServiceConnections,
  getServiceConnectionById,
  createServiceConnection,
  updateServiceConnection,
  deleteServiceConnection,
  disconnectCustomerConnections
} from '../controllers/serviceConnectionController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Base: /api/service-connections

// GET /api/service-connections
router.get('/', verifyToken, getAllServiceConnections);

// GET /api/service-connections/:id
router.get('/:id', verifyToken, getServiceConnectionById);

// PUT /api/service-connections/disconnect-customer/:customerId (must be before /:id route)
router.put('/disconnect-customer/:customerId', verifyToken, disconnectCustomerConnections);

// POST /api/service-connections
router.post('/', verifyToken, createServiceConnection);

// PUT /api/service-connections/:id
router.put('/:id', verifyToken, updateServiceConnection);

// DELETE /api/service-connections/:id
router.delete('/:id', verifyToken, deleteServiceConnection);

export default router;
