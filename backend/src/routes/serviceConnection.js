import express from 'express';
import {
  getAllServiceConnections,
  getServiceConnectionById,
  createServiceConnection,
  updateServiceConnection,
  deleteServiceConnection
} from '../controllers/serviceConnectionController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Base: /api/service-connections

// GET /api/service-connections
router.get('/', verifyToken, getAllServiceConnections);

// GET /api/service-connections/:id
router.get('/:id', verifyToken, getServiceConnectionById);

// POST /api/service-connections
router.post('/', verifyToken, createServiceConnection);

// PUT /api/service-connections/:id
router.put('/:id', verifyToken, updateServiceConnection);

// DELETE /api/service-connections/:id
router.delete('/:id', verifyToken, deleteServiceConnection);

export default router;
