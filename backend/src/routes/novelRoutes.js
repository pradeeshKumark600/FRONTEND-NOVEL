import express from 'express';
import {
  getAllNovels,
  getNovelById,
  getNovelBySlug,
  getRatsasaneNovel,
  getNovelsByGenre,
  getNovelsByAuthor,
  searchNovels,
  bookmarkNovel,
  removeBookmark,
  likeNovel
} from '../controllers/novelController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { validateNovelId } from '../middleware/validator.js';

const router = express.Router();

// Public novel routes
router.get('/', optionalAuth, getAllNovels);
router.get('/search', searchNovels);
router.get('/slug', getNovelBySlug);
router.get('/genre', getNovelsByGenre);
router.get('/author', getNovelsByAuthor);
router.get('/ratsasane-enai-vathaippathena', getRatsasaneNovel);
router.get('/:id', validateNovelId, optionalAuth, getNovelById);

// Protected novel routes
router.post('/bookmark', protect, bookmarkNovel);
router.delete('/bookmark', protect, removeBookmark);
router.post('/like', protect, likeNovel);

export default router;
