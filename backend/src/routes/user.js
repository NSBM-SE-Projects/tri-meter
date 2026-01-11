import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  resetPassword,
  deactivateUser
} from '../controllers/userController.js';
import { userUpload } from '../middleware/upload.js';

const router = express.Router();

/**
 * User Routes
 * Base: /api/users
 */

// GET /api/users - Get all users with optional filters
router.get('/', getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', getUserById);

// POST /api/users - Create new user (with file uploads)
router.post('/', userUpload.fields([
  { name: 'idCard', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), createUser);

// PUT /api/users/:id - Update user (with optional file uploads)
router.put('/:id', userUpload.fields([
  { name: 'idCard', maxCount: 1 },
  { name: 'profilePhoto', maxCount: 1 }
]), updateUser);

// POST /api/users/:id/reset-password - Reset user password
router.post('/:id/reset-password', resetPassword);

// PUT /api/users/:id/deactivate - Deactivate user
router.put('/:id/deactivate', deactivateUser);

export default router;
