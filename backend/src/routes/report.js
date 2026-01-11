import express from 'express';
import {
  getUnpaidBillsSummary,
  getMonthlyRevenue,
  getCustomerBillingSummary,
  getTopConsumers
} from '../controllers/reportController.js';

const router = express.Router();

// Base: /api/reports

// GET /api/reports/unpaid-bills-summary?utilityType=Electricity&minDaysOverdue=30
router.get('/unpaid-bills-summary', getUnpaidBillsSummary);

// GET /api/reports/monthly-revenue?startMonth=2025-01&endMonth=2025-12&utilityType=Electricity
router.get('/monthly-revenue', getMonthlyRevenue);

// GET /api/reports/customer-billing-summary?customerType=Business&sortBy=outstandingBalance&sortOrder=DESC
router.get('/customer-billing-summary', getCustomerBillingSummary);

// GET /api/reports/top-consumers?utilityType=Electricity&limit=10
router.get('/top-consumers', getTopConsumers);

export default router;
