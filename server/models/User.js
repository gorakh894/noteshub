const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format']
  },
  password: {
    type: String,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  googleId: { type: String, sparse: true },
  avatar: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['student', 'faculty', 'coordinator', 'admin'],
    default: 'student'
  },
  branch: {
    type: String,
    enum: ['IT', 'CS', 'AIDS', 'Electronics', 'Mechanical', 'Civil', 'Electrical', 'Other'],
  },
  year: {
    type: String,
    enum: ['FY', 'SY', 'TY', 'Final'],
  },
  semester: {
    type: Number,
    min: 1,
    max: 8
  },
  college: { type: String, trim: true },
  bio: { type: String, maxlength: 300 },
  isEmailVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  // Gamification
  contributionScore: { type: Number, default: 0 },
  badges: [{
    name: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now }
  }],
  downloadCount: { type: Number, default: 0 },
  uploadCount: { type: Number, default: 0 },

  // Social
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Note' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  lastActive: { type: Date, default: Date.now },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual: full avatar URL fallback
userSchema.virtual('avatarUrl').get(function () {
  return this.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name)}&background=6366f1&color=fff`;
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate email verification token
userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return token;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
  this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  return token;
};

module.exports = mongoose.model('User', userSchema);
