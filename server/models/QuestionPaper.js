const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  branch: {
    type: String,
    required: true,
    enum: ['IT', 'CS', 'AIDS', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Other']
  },
  year: {
    type: String,
    required: true,
    enum: ['FY', 'SY', 'TY', 'Final']
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  examYear: {
    type: Number,
    required: [true, 'Exam year is required'],
    min: 2000,
    max: new Date().getFullYear() + 1
  },
  examMonth: {
    type: String,
    enum: ['May', 'November', 'April', 'October', 'March', 'Other']
  },
  university: {
    type: String,
    default: 'SPPU',
    trim: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  filePublicId: String,
  solutionUrl: String,
  solutionPublicId: String,

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  downloadCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  isVerified: { type: Boolean, default: false },
}, {
  timestamps: true
});

questionPaperSchema.index({ subject: 1, branch: 1, semester: 1 });
questionPaperSchema.index({ examYear: -1, university: 1 });

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);
