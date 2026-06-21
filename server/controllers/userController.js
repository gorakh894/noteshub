const User = require('../models/User');
const Note = require('../models/Note');
const { deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get user profile
// @route   GET /api/users/:id
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -resetPasswordToken -emailVerificationToken -googleId');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const noteCount = await Note.countDocuments({ author: user._id, status: 'approved' });
    const totalDownloads = await Note.aggregate([
      { $match: { author: user._id, status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    res.json({
      success: true,
      user,
      stats: {
        noteCount,
        totalDownloads: totalDownloads[0]?.total || 0,
        contributionScore: user.contributionScore,
        badges: user.badges
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, branch, year, semester, college, bio } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (branch) updates.branch = branch;
    if (year) updates.year = year;
    if (semester) updates.semester = parseInt(semester);
    if (college !== undefined) updates.college = college;
    if (bio !== undefined) updates.bio = bio;

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true
    }).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update avatar
// @route   PUT /api/users/avatar
const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const user = await User.findById(req.user._id);

    // Delete old avatar from cloudinary if it's a cloudinary URL
    if (user.avatar && user.avatar.includes('cloudinary')) {
      const publicId = user.avatar.split('/').pop().split('.')[0];
      await deleteFromCloudinary(`enginotes/avatars/${publicId}`, 'image');
    }

    user.avatar = req.file.path;
    await user.save({ validateBeforeSave: false });

    res.json({ success: true, avatar: user.avatar });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');

    if (user.password) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookmarks
// @route   GET /api/users/bookmarks
const getBookmarks = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;

    const user = await User.findById(req.user._id)
      .populate({
        path: 'bookmarks',
        match: { status: 'approved' },
        populate: { path: 'author', select: 'name avatar' },
        options: {
          skip: (pageNum - 1) * limitNum,
          limit: limitNum
        }
      });

    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow/Unfollow user
// @route   POST /api/users/:id/follow
const followUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const currentUser = await User.findById(req.user._id);
    const isFollowing = currentUser.following.includes(req.params.id);

    if (isFollowing) {
      currentUser.following.pull(req.params.id);
      targetUser.followers.pull(req.user._id);
    } else {
      currentUser.following.push(req.params.id);
      targetUser.followers.push(req.user._id);
    }

    await Promise.all([
      currentUser.save({ validateBeforeSave: false }),
      targetUser.save({ validateBeforeSave: false })
    ]);

    res.json({
      success: true,
      isFollowing: !isFollowing,
      message: isFollowing ? 'Unfollowed' : 'Following'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard
// @route   GET /api/users/leaderboard
const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ isActive: true })
      .sort('-contributionScore')
      .limit(20)
      .select('name avatar branch year contributionScore uploadCount downloadCount badges');

    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserProfile, updateProfile, updateAvatar, changePassword, getBookmarks, followUser, getLeaderboard };
