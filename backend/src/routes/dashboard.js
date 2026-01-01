import express from 'express';
import {
  getDashboardStats,
  getRevenueTrends,
  getRecentActivity
} from '../controllers/dashboardController.js';

const router = express.Router();

/**
 * Dashboard Routes
 * Base: /api/dashboard
 */

// GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

// GET /api/dashboard/revenue-trends
router.get('/revenue-trends', getRevenueTrends);

// GET /api/dashboard/activity
router.get('/activity', getRecentActivity);

export default router;
