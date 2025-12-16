import Novel from '../models/Novel.js';
import Chapter from '../models/Chapter.js';
import User from '../models/User.js';

// @desc    Get all novels
// @route   GET /api/novels
// @access  Public
export const getAllNovels = async (req, res, next) => {
  try {
    const { genre, author, search, sort = '-createdAt', limit = 50 } = req.query;

    let query = { status: 'published' };

    // Filter by genre
    if (genre) {
      query.genre = genre;
    }

    // Filter by author
    if (author) {
      query.author = { $regex: author, $options: 'i' };
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'description.tamil': { $regex: search, $options: 'i' } },
        { 'description.english': { $regex: search, $options: 'i' } }
      ];
    }

    const novels = await Novel.find(query)
      .sort(sort)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: novels.length,
      novels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single novel by ID
// @route   GET /api/novels/:id
// @access  Public
export const getNovelById = async (req, res, next) => {
  try {
    const novel = await Novel.findById(req.params.id);

    if (!novel) {
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }

    // Increment views
    novel.stats.views += 1;
    await novel.save();

    res.status(200).json({
      success: true,
      novel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get novel by slug
// @route   GET /api/novels/slug
// @access  Public
export const getNovelBySlug = async (req, res, next) => {
  try {
    const { slug } = req.query;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: 'Slug parameter is required'
      });
    }

    const novel = await Novel.findOne({ slug, status: 'published' });

    if (!novel) {
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }

    // Increment views
    novel.stats.views += 1;
    await novel.save();

    res.status(200).json({
      success: true,
      novel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get specific novel "ராட்சசனே எனை வதைப்பதேனடா!"
// @route   GET /api/novels/ratsasane-enai-vathaippathena
// @access  Public
export const getRatsasaneNovel = async (req, res, next) => {
  try {
    const novel = await Novel.findOne({
      slug: 'ratsasane-enai-vathaippathena'
    }).populate('chapters');

    if (!novel) {
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }

    // Get all chapters for this novel
    const chapters = await Chapter.find({ novel: novel._id })
      .sort({ chapterNumber: 1 })
      .select('-content'); // Exclude full content from list

    // Increment views
    novel.stats.views += 1;
    await novel.save();

    res.status(200).json({
      success: true,
      novel: {
        ...novel.toObject(),
        chapters
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get novels by genre
// @route   GET /api/novels/genre
// @access  Public
export const getNovelsByGenre = async (req, res, next) => {
  try {
    const { genre } = req.query;

    if (!genre) {
      return res.status(400).json({
        success: false,
        message: 'Genre parameter is required'
      });
    }

    const novels = await Novel.find({
      genre: { $regex: new RegExp(genre, 'i') },
      status: 'published'
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: novels.length,
      novels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get novels by author
// @route   GET /api/novels/author
// @access  Public
export const getNovelsByAuthor = async (req, res, next) => {
  try {
    const { author } = req.query;

    if (!author) {
      return res.status(400).json({
        success: false,
        message: 'Author parameter is required'
      });
    }

    const novels = await Novel.find({
      author: { $regex: author, $options: 'i' },
      status: 'published'
    }).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: novels.length,
      novels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search novels
// @route   GET /api/novels/search
// @access  Public
export const searchNovels = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const novels = await Novel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
        { 'description.tamil': { $regex: query, $options: 'i' } },
        { 'description.english': { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } }
      ],
      status: 'published'
    }).sort('-stats.views');

    res.status(200).json({
      success: true,
      count: novels.length,
      novels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark a novel
// @route   POST /api/novels/bookmark
// @access  Private
export const bookmarkNovel = async (req, res, next) => {
  try {
    const { novelId } = req.body;

    const novel = await Novel.findById(novelId);
    if (!novel) {
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Check if already bookmarked
    if (user.bookmarkedNovels.includes(novelId)) {
      return res.status(400).json({
        success: false,
        message: 'Novel already bookmarked'
      });
    }

    user.bookmarkedNovels.push(novelId);
    await user.save();

    novel.stats.bookmarks += 1;
    await novel.save();

    res.status(200).json({
      success: true,
      message: 'Novel bookmarked successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove bookmark
// @route   DELETE /api/novels/bookmark
// @access  Private
export const removeBookmark = async (req, res, next) => {
  try {
    const { novelId } = req.body;

    const user = await User.findById(req.user._id);

    user.bookmarkedNovels = user.bookmarkedNovels.filter(
      id => id.toString() !== novelId
    );
    await user.save();

    const novel = await Novel.findById(novelId);
    if (novel) {
      novel.stats.bookmarks = Math.max(0, novel.stats.bookmarks - 1);
      await novel.save();
    }

    res.status(200).json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a novel
// @route   POST /api/novels/like
// @access  Private
export const likeNovel = async (req, res, next) => {
  try {
    const { novelId } = req.body;

    const novel = await Novel.findById(novelId);
    if (!novel) {
      return res.status(404).json({
        success: false,
        message: 'Novel not found'
      });
    }

    const user = await User.findById(req.user._id);

    // Toggle like
    const isLiked = user.likedNovels.includes(novelId);

    if (isLiked) {
      user.likedNovels = user.likedNovels.filter(
        id => id.toString() !== novelId
      );
      novel.stats.likes = Math.max(0, novel.stats.likes - 1);
    } else {
      user.likedNovels.push(novelId);
      novel.stats.likes += 1;
    }

    await user.save();
    await novel.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Like removed' : 'Novel liked successfully',
      isLiked: !isLiked
    });
  } catch (error) {
    next(error);
  }
};
