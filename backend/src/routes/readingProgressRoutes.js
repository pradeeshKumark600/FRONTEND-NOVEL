import express from 'express';
import {
  getReadingProgress,
  updateReadingProgress,
  markChapterComplete,
  deleteReadingProgress
} from '../controllers/readingProgressController.js';
import { protect } from '../middleware/auth.js';
import { validateReadingProgress } from '../middleware/validator.js';

const router = express.Router();

// All reading progress routes require authentication
router.use(protect);

router.get('/progress', getReadingProgress);
router.post('/progress', validateReadingProgress, updateReadingProgress);
router.post('/progress/complete-chapter', markChapterComplete);
router.delete('/progress/:novelId', deleteReadingProgress);

export default router;
