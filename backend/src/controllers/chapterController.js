import Chapter from '../models/Chapter.js';
import Novel from '../models/Novel.js';

// @desc    Get all chapters for a novel
// @route   GET /api/novels/:id/chapters
// @access  Public
export const getNovelChapters = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { language } = req.query;

    const novel = await Novel.findById(id);
    if (!novel) {
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }

    const chapters = await Chapter.find({ novel: id, isPublished: true })
      .sort({ chapterNumber: 1 })
      .select('-content'); // Don't send full content in list view

    res.status(200).json({
      success: true,
      count: chapters.length,
      chapters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific chapter
// @route   GET /api/novels/:novelId/chapters/:chapterId
// @access  Public
export const getChapter = async (req, res, next) => {
  try {
    const { novelId, chapterId } = req.params;

    const chapter = await Chapter.findOne({
      _id: chapterId,
      novel: novelId,
      isPublished: true
    }).populate('novel', 'title author slug coverImage');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    res.status(200).json({
      success: true,
      chapter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chapter by number
// @route   GET /api/novels/:novelId/chapters/number/:chapterNumber
// @access  Public
export const getChapterByNumber = async (req, res, next) => {
  try {
    const { novelId, chapterNumber } = req.params;

    const chapter = await Chapter.findOne({
      novel: novelId,
      chapterNumber: parseInt(chapterNumber),
      isPublished: true
    }).populate('novel', 'title author slug coverImage');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    res.status(200).json({
      success: true,
      chapter
    });
  } catch (error) {
    next(error);
  }
};
