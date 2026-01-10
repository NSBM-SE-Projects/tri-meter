import express from 'express';
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

// POST /api/payments
router.post('/', recordPayment);

export default router;
