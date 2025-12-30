import express from 'express';
import { createInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

// POST /api/inquiries
router.post('/', createInquiry);

export default router;
