const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Answer content is required'],
    maxlength: 5000
  },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isAccepted: { type: Boolean, default: false },
  attachments: [String],
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

answerSchema.virtual('voteCount').get(function () {
  return this.upvotes.length - this.downvotes.length;
});

const discussionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 300
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: 10000
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: { type: String, trim: true },
  branch: {
    type: String,
    enum: ['IT', 'CS', 'AIDS', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Other', 'General']
  },
  semester: { type: Number, min: 1, max: 8 },
  tags: [{ type: String, trim: true, lowercase: true }],
  category: {
    type: String,
    enum: ['Question', 'Discussion', 'Resource', 'Help', 'Announcement'],
    default: 'Question'
  },
  answers: [answerSchema],
  views: { type: Number, default: 0 },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isResolved: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  attachments: [String],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

discussionSchema.virtual('answerCount').get(function () {
  return this.answers.length;
});

discussionSchema.index({ title: 'text', content: 'text', tags: 'text' });
discussionSchema.index({ branch: 1, semester: 1 });
discussionSchema.index({ author: 1, createdAt: -1 });

module.exports = mongoose.model('Discussion', discussionSchema);
