import express from 'express';
import {
  getAllBills,
  getBillById,
  generateBill,
  getCustomersForBilling,
  getServiceConnectionsByCustomer,
  sendBillEmail
} from '../controllers/billController.js';

const router = express.Router();

/**
 * Bill Routes
 * Base: /api/bills
 */

// GET /api/bills - Get all bills with filters
router.get('/', getAllBills);

// GET /api/bills/customers - Get customers for bill generation
router.get('/customers', getCustomersForBilling);

// GET /api/bills/service-connections/:customerId - Get service connections for a customer
router.get('/service-connections/:customerId', getServiceConnectionsByCustomer);

// POST /api/bills/:id/send-email - Send bill via email
router.post('/:id/send-email', sendBillEmail);

// GET /api/bills/:id - Get bill by ID (must be after more specific routes)
router.get('/:id', getBillById);

// POST /api/bills - Generate new bill
router.post('/', generateBill);

export default router;
