import express from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import {
  getAllPayments,
  getPaymentById,
  recordPayment,
  getBillsForPayment
} from '../controllers/paymentController.js';

const router = express.Router();

// Base: /api/payments

// GET /api/payments
router.get('/', getAllPayments);

// GET /api/payments/bills/:customerId (must come before /:id)
router.get('/bills/:customerId', getBillsForPayment);

// GET /api/payments/:id
router.get('/:id', getPaymentById);

// POST /api/payments - Requires authentication (Cashier/Admin)
router.post('/', verifyToken, requireRole('Cashier', 'Admin'), recordPayment);

export default router;
