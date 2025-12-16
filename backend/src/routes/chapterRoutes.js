import express from 'express';
import {
  getNovelChapters,
  getChapter,
  getChapterByNumber
} from '../controllers/chapterController.js';
import { validateNovelId, validateChapterId } from '../middleware/validator.js';

const router = express.Router({ mergeParams: true });

// Chapter routes
router.get('/', validateNovelId, getNovelChapters);
router.get('/number/:chapterNumber', getChapterByNumber);
router.get('/:chapterId', validateChapterId, getChapter);

export default router;
