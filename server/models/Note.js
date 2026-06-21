const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  branch: {
    type: String,
    required: [true, 'Branch is required'],
    enum: ['IT', 'CS', 'AIDS', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Other']
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: ['FY', 'SY', 'TY', 'Final']
  },
  semester: {
    type: Number,
    required: [true, 'Semester is required'],
    min: 1,
    max: 8
  },
  unit: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Lecture Notes',
      'Handwritten Notes',
      'Practical Journal',
      'Assignment',
      'Lab Manual',
      'Mini Project',
      'Cheat Sheet',
      'PPT',
      'Previous Year Paper',
      'Viva Q&A',
      'Other'
    ]
  },
  tags: [{ type: String, trim: true, lowercase: true }],
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  filePublicId: String,
  fileType: {
    type: String,
    enum: ['pdf', 'docx', 'doc', 'pptx', 'ppt', 'image', 'zip', 'other']
  },
  fileSize: Number, // in bytes
  thumbnailUrl: String,

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  faculty: { type: String, trim: true },
  college: { type: String, trim: true },
  university: { type: String, trim: true },

  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: Date,

  // Stats
  downloadCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },

  // Ratings
  ratings: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    createdAt: { type: Date, default: Date.now }
  }],
  averageRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },

  isExamImportant: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for fast search
noteSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' });
noteSchema.index({ branch: 1, year: 1, semester: 1 });
noteSchema.index({ subject: 1, category: 1 });
noteSchema.index({ author: 1, status: 1 });
noteSchema.index({ downloadCount: -1 });
noteSchema.index({ averageRating: -1 });
noteSchema.index({ createdAt: -1 });

// Calculate average rating before save
noteSchema.pre('save', function (next) {
  if (this.ratings.length > 0) {
    const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
    this.averageRating = Math.round((total / this.ratings.length) * 10) / 10;
    this.ratingCount = this.ratings.length;
  }
  next();
});

module.exports = mongoose.model('Note', noteSchema);
