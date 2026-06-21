const User = require('../models/User');
const Note = require('../models/Note');
const QuestionPaper = require('../models/QuestionPaper');
const Discussion = require('../models/Discussion');
const Notification = require('../models/Notification');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get dashboard analytics
// @route   GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers, totalNotes, totalPapers, totalDiscussions,
      pendingNotes, pendingPapers,
      approvedNotes, recentUsers, topNotes, topContributors
    ] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Note.countDocuments(),
      QuestionPaper.countDocuments(),
      Discussion.countDocuments(),
      Note.countDocuments({ status: 'pending' }),
      QuestionPaper.countDocuments({ status: 'pending' }),
      Note.countDocuments({ status: 'approved' }),
      User.find().sort('-createdAt').limit(5).select('name email avatar branch year createdAt'),
      Note.find({ status: 'approved' }).sort('-downloadCount').limit(5)
        .populate('author', 'name avatar').select('title subject downloadCount averageRating'),
      User.find().sort('-contributionScore').limit(10)
        .select('name avatar contributionScore uploadCount downloadCount badges branch')
    ]);

    // Monthly signups (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySignups = await User.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Notes by branch
    const notesByBranch = await Note.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$branch', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Notes by category
    const notesByCategory = await Note.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Total downloads
    const totalDownloads = await Note.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalNotes,
        totalPapers,
        totalDiscussions,
        pendingNotes,
        pendingPapers,
        approvedNotes,
        totalDownloads: totalDownloads[0]?.total || 0,
      },
      recentUsers,
      topNotes,
      topContributors,
      charts: {
        monthlySignups,
        notesByBranch,
        notesByCategory
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const { search, role, branch, isActive, page, limit } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (branch) filter.branch = branch;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { email: regex }];
    }

    const total = await User.countDocuments(filter);
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 20;

    const users = await User.find(filter)
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('-password -resetPasswordToken -emailVerificationToken');

    res.json({ success: true, count: users.length, total, totalPages: Math.ceil(total / limitNum), users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role / block
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res, next) => {
  try {
    const { role, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save({ validateBeforeSave: false });

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending notes
// @route   GET /api/admin/notes/pending
const getPendingNotes = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const total = await Note.countDocuments({ status: 'pending' });
    const notes = await Note.find({ status: 'pending' })
      .populate('author', 'name email avatar branch year')
      .sort('createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({ success: true, count: notes.length, total, notes });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve a note
// @route   PUT /api/admin/notes/:id/approve
const approveNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        status: 'approved',
        approvedBy: req.user._id,
        approvedAt: Date.now(),
        $unset: { rejectionReason: 1 }
      },
      { new: true }
    ).populate('author', 'name email');

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Award contribution points
    await User.findByIdAndUpdate(note.author._id, { $inc: { contributionScore: 15 } });

    // Create notification
    await Notification.create({
      recipient: note.author._id,
      sender: req.user._id,
      type: 'note_approved',
      title: 'Note Approved! 🎉',
      message: `Your note "${note.title}" has been approved.`,
      link: `/notes/${note._id}`
    });

    // Send email
    try {
      await sendEmail({
        to: note.author.email,
        subject: 'Your Note Has Been Approved - EngiNotes Hub',
        html: emailTemplates.noteApproved(note.author.name, note.title)
      });
    } catch (e) { /* silent */ }

    res.json({ success: true, message: 'Note approved', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject a note
// @route   PUT /api/admin/notes/:id/reject
const rejectNote = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected', rejectionReason: reason || 'Does not meet quality standards' },
      { new: true }
    ).populate('author', 'name email');

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Create notification
    await Notification.create({
      recipient: note.author._id,
      type: 'note_rejected',
      title: 'Note Not Approved',
      message: `Your note "${note.title}" was not approved. Reason: ${reason}`,
      link: `/dashboard/uploads`
    });

    try {
      await sendEmail({
        to: note.author.email,
        subject: 'Note Review Result - EngiNotes Hub',
        html: emailTemplates.noteRejected(note.author.name, note.title, reason)
      });
    } catch (e) { /* silent */ }

    res.json({ success: true, message: 'Note rejected', note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete any note (admin)
// @route   DELETE /api/admin/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.filePublicId) {
      await deleteFromCloudinary(note.filePublicId, note.fileType === 'image' ? 'image' : 'raw');
    }

    await note.deleteOne();

    res.json({ success: true, message: 'Note deleted by admin' });
  } catch (error) {
    next(error);
  }
};

// @desc    Feature/unfeature a note
// @route   PUT /api/admin/notes/:id/feature
const featureNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

    note.isFeatured = !note.isFeatured;
    await note.save({ validateBeforeSave: false });

    res.json({ success: true, isFeatured: note.isFeatured });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve question paper
// @route   PUT /api/admin/papers/:id/approve
const approvePaper = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      { status: 'approved', isVerified: true },
      { new: true }
    );

    if (!paper) return res.status(404).json({ success: false, message: 'Paper not found' });

    res.json({ success: true, paper });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats, getUsers, updateUser, getPendingNotes,
  approveNote, rejectNote, deleteNote, featureNote, approvePaper
};
