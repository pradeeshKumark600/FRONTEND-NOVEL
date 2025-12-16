import mongoose from 'mongoose';
import { READING_STATUS } from '../config/constants.js';

const readingProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true,
    index: true
  },
  currentChapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    default: null
  },
  lastChapterRead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chapter',
    default: null
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: Object.values(READING_STATUS),
    default: READING_STATUS.NOT_STARTED
  },
  chaptersRead: [{
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter'
    },
    readAt: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  lastReadAt: {
    type: Date,
    default: Date.now
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Ensure one progress record per user per novel
readingProgressSchema.index({ user: 1, novel: 1 }, { unique: true });

// Update lastReadAt on save
readingProgressSchema.pre('save', function(next) {
  if (this.isModified('currentChapter') || this.isModified('progress')) {
    this.lastReadAt = new Date();
  }

  // Mark as completed if progress is 100%
  if (this.progress >= 100 && !this.completedAt) {
    this.completedAt = new Date();
    this.status = READING_STATUS.COMPLETED;
  }

  next();
});

const ReadingProgress = mongoose.model('ReadingProgress', readingProgressSchema);

export default ReadingProgress;
