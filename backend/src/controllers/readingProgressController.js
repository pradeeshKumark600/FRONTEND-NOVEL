import ReadingProgress from '../models/ReadingProgress.js';
import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';

// @desc    Get reading progress for a novel
// @route   GET /api/reading/progress
// @access  Private
export const getReadingProgress = async (req, res, next) => {
  try {
    const { novelId } = req.query;

    if (!novelId) {
      // Get all reading progress for user
      const allProgress = await ReadingProgress.find({ user: req.user._id })
        .populate('novel', 'title slug coverImage author totalChapters')
        .populate('currentChapter', 'chapterNumber title')
        .sort('-lastReadAt');

      return res.status(200).json({
        success: true,
        count: allProgress.length,
        progress: allProgress
      });
    }

    // Get progress for specific novel
    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      novel: novelId
    })
      .populate('novel', 'title slug coverImage author totalChapters')
      .populate('currentChapter', 'chapterNumber title')
      .populate('lastChapterRead', 'chapterNumber title');

    res.status(200).json({
      success: true,
      progress: progress || null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update reading progress
// @route   POST /api/reading/progress
// @access  Private
export const updateReadingProgress = async (req, res, next) => {
  try {
    const { novelId, chapterId, progress } = req.body;

    // Verify novel exists
    const novel = await Novel.findById(novelId);
    if (!novel) {
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }

    // Verify chapter exists if provided
    let chapter = null;
    if (chapterId) {
      chapter = await Chapter.findById(chapterId);
      if (!chapter) {
        return res.status(404).json({
          success: false,
          message: 'Chapter not found'
        });
      }
    }

    // Find or create reading progress
    let readingProgress = await ReadingProgress.findOne({
      user: req.user._id,
      novel: novelId
    });

    if (!readingProgress) {
      // Create new reading progress
      readingProgress = new ReadingProgress({
        user: req.user._id,
        novel: novelId,
        currentChapter: chapterId,
        lastChapterRead: chapterId,
        progress: progress || 0,
        status: 'reading'
      });

      if (chapterId) {
        readingProgress.chaptersRead.push({
          chapter: chapterId,
          readAt: new Date(),
          completed: false
        });
      }
    } else {
      // Update existing progress
      if (chapterId) {
        readingProgress.currentChapter = chapterId;
        readingProgress.lastChapterRead = chapterId;

        // Add to chaptersRead if not already there
        const alreadyRead = readingProgress.chaptersRead.some(
          cr => cr.chapter.toString() === chapterId
        );

        if (!alreadyRead) {
          readingProgress.chaptersRead.push({
            chapter: chapterId,
            readAt: new Date(),
            completed: false
          });
        } else {
          // Update the existing chapter read entry
          const chapterReadIndex = readingProgress.chaptersRead.findIndex(
            cr => cr.chapter.toString() === chapterId
          );
          readingProgress.chaptersRead[chapterReadIndex].readAt = new Date();
        }
      }

      if (progress !== undefined) {
        readingProgress.progress = progress;
      }

      readingProgress.status = 'reading';
      readingProgress.lastReadAt = new Date();
    }

    await readingProgress.save();

    // Populate before sending response
    await readingProgress.populate('novel', 'title slug coverImage author totalChapters');
    await readingProgress.populate('currentChapter', 'chapterNumber title');
    await readingProgress.populate('lastChapterRead', 'chapterNumber title');

    res.status(200).json({
      success: true,
      message: 'Reading progress updated successfully',
      progress: readingProgress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark chapter as completed
// @route   POST /api/reading/progress/complete-chapter
// @access  Private
export const markChapterComplete = async (req, res, next) => {
  try {
    const { novelId, chapterId } = req.body;

    const readingProgress = await ReadingProgress.findOne({
      user: req.user._id,
      novel: novelId
    });

    if (!readingProgress) {
      return res.status(404).json({
        success: false,
        message: 'Reading progress not found'
      });
    }

    // Find the chapter in chaptersRead and mark as completed
    const chapterReadIndex = readingProgress.chaptersRead.findIndex(
      cr => cr.chapter.toString() === chapterId
    );

    if (chapterReadIndex !== -1) {
      readingProgress.chaptersRead[chapterReadIndex].completed = true;
    } else {
      readingProgress.chaptersRead.push({
        chapter: chapterId,
        readAt: new Date(),
        completed: true
      });
    }

    // Calculate progress based on completed chapters
    const novel = await Novel.findById(novelId);
    const completedChaptersCount = readingProgress.chaptersRead.filter(
      cr => cr.completed
    ).length;

    if (novel.totalChapters > 0) {
      readingProgress.progress = Math.round(
        (completedChaptersCount / novel.totalChapters) * 100
      );
    }

    await readingProgress.save();

    res.status(200).json({
      success: true,
      message: 'Chapter marked as completed',
      progress: readingProgress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete reading progress
// @route   DELETE /api/reading/progress/:novelId
// @access  Private
export const deleteReadingProgress = async (req, res, next) => {
  try {
    const { novelId } = req.params;

    const result = await ReadingProgress.findOneAndDelete({
      user: req.user._id,
      novel: novelId
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Reading progress not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Reading progress deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
