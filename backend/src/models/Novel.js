import mongoose from 'mongoose';
import { NOVEL_GENRES } from '../config/constants.js';

const novelSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Novel title is required'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  description: {
    tamil: {
      type: String,
      required: true
    },
    english: {
      type: String,
      required: true
    }
  },
  genre: {
    type: String,
    enum: NOVEL_GENRES,
    required: [true, 'Genre is required']
  },
  coverImage: {
    type: String,
    default: null
  },
  authorAvatar: {
    type: String,
    default: null
  },
  totalChapters: {
    type: Number,
    default: 0
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  stats: {
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    bookmarks: {
      type: Number,
      default: 0
    },
    downloads: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'published'
  },
  languages: [{
    type: String,
    enum: ['tamil', 'english'],
    default: ['tamil']
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate chapters
novelSchema.virtual('chapters', {
  ref: 'Chapter',
  localField: '_id',
  foreignField: 'novel'
});

// Create slug from title before saving
novelSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Indexes for better query performance
novelSchema.index({ slug: 1 });
novelSchema.index({ author: 1 });
novelSchema.index({ genre: 1 });
novelSchema.index({ 'stats.views': -1 });
novelSchema.index({ 'rating.average': -1 });

const Novel = mongoose.model('Novel', novelSchema);

export default Novel;
