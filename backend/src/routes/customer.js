import express from 'express';
import {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} from '../controllers/customerController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

//Base URL: /api/customers

// GET /api/customers - Get all customers
router.get('/', getAllCustomers);

// GET /api/customers/:id - Get customer by ID
router.get('/:id', getCustomerById);

// POST /api/customers - Create new customer
router.post('/', upload.single('idImage'), createCustomer);

// PUT /api/customers/:id - Update customer
router.put('/:id', upload.single('idImage'), updateCustomer);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', deleteCustomer);

export default router;
