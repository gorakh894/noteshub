const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: [
      'new_note', 'comment', 'answer', 'upvote', 'download',
      'group_invite', 'group_message', 'note_approved', 'note_rejected',
      'badge_earned', 'follow', 'exam_reminder', 'system'
    ],
    required: true
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String, // redirect URL
  isRead: { type: Boolean, default: false },
  data: mongoose.Schema.Types.Mixed, // additional data
}, {
  timestamps: true
});

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
