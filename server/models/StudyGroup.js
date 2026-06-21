const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  attachments: [String],
  type: {
    type: String,
    enum: ['text', 'file', 'system'],
    default: 'text'
  },
}, {
  timestamps: true
});

const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  subject: { type: String, trim: true },
  branch: {
    type: String,
    enum: ['IT', 'CS', 'AIDS', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Other', 'All']
  },
  semester: { type: Number, min: 1, max: 8 },
  avatar: { type: String },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  }],
  sharedResources: [{
    note: { type: mongoose.Schema.Types.ObjectId, ref: 'Note' },
    sharedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sharedAt: { type: Date, default: Date.now }
  }],
  messages: [messageSchema],
  isPrivate: { type: Boolean, default: false },
  inviteCode: { type: String, unique: true, sparse: true },
  maxMembers: { type: Number, default: 50 },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

studyGroupSchema.virtual('memberCount').get(function () {
  return this.members.length;
});

module.exports = mongoose.model('StudyGroup', studyGroupSchema);
