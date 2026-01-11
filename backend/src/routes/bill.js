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

// Base: /api/bills

// GET /api/bills
router.get('/', getAllBills);

// GET /api/bills/customers
router.get('/customers', getCustomersForBilling);

// GET /api/bills/service-connections/:customerId
router.get('/service-connections/:customerId', getServiceConnectionsByCustomer);

// POST /api/bills/:id/send-email
router.post('/:id/send-email', sendBillEmail);

// GET /api/bills/:id
router.get('/:id', getBillById);

// POST /api/bills
router.post('/', generateBill);

export default router;
