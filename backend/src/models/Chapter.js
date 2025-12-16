import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
  novel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Novel',
    required: true,
    index: true
  },
  chapterNumber: {
    type: Number,
    required: [true, 'Chapter number is required'],
    min: 1
  },
  title: {
    tamil: {
      type: String,
      required: true,
      trim: true
    },
    english: {
      type: String,
      required: true,
      trim: true
    }
  },
  content: {
    tamil: {
      type: String,
      required: true
    },
    english: {
      type: String,
      required: true
    }
  },
  summary: {
    tamil: String,
    english: String
  },
  wordCount: {
    tamil: {
      type: Number,
      default: 0
    },
    english: {
      type: Number,
      default: 0
    }
  },
  publishedDate: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

// Calculate word count before saving
chapterSchema.pre('save', function(next) {
  if (this.isModified('content.tamil')) {
    this.wordCount.tamil = this.content.tamil.split(/\s+/).length;
  }
  if (this.isModified('content.english')) {
    this.wordCount.english = this.content.english.split(/\s+/).length;
  }
  next();
});

// Compound index for novel and chapter number
chapterSchema.index({ novel: 1, chapterNumber: 1 }, { unique: true });
chapterSchema.index({ novel: 1, order: 1 });

const Chapter = mongoose.model('Chapter', chapterSchema);

export default Chapter;
