import express from 'express';
import {
  signup,
  login,
  logout,
  refreshToken,
  verifyToken,
  getProfile,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validateSignup, validateLogin } from '../middleware/validator.js';

const router = express.Router();

// Auth routes
router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', protect, logout);
router.post('/refresh', refreshToken);
router.get('/verify', protect, verifyToken);

// User profile routes
router.get('/user/profile', protect, getProfile);
router.put('/user/profile', protect, updateProfile);

export default router;
