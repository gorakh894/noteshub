const Note = require('../models/Note');
const User = require('../models/User');
const Notification = require('../models/Notification');
const APIFeatures = require('../utils/apiFeatures');
const { deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all notes (with filters, search, pagination)
// @route   GET /api/notes
const getNotes = async (req, res, next) => {
  try {
    const { branch, year, semester, subject, category, search, sort, page, limit, examImportant } = req.query;

    const filter = { status: 'approved' };
    if (branch) filter.branch = branch;
    if (year) filter.year = year;
    if (semester) filter.semester = parseInt(semester);
    if (subject) filter.subject = new RegExp(subject, 'i');
    if (category) filter.category = category;
    if (examImportant === 'true') filter.isExamImportant = true;

    let query = Note.find(filter).populate('author', 'name avatar branch year');

    // Text search
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = Note.find({
        ...filter,
        $or: [
          { title: searchRegex },
          { subject: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { faculty: searchRegex },
          { unit: searchRegex }
        ]
      }).populate('author', 'name avatar branch year');
    }

    // Sorting
    const sortOptions = {
      newest: '-createdAt',
      oldest: 'createdAt',
      most_downloaded: '-downloadCount',
      highest_rated: '-averageRating',
      most_viewed: '-viewCount',
    };
    query = query.sort(sortOptions[sort] || '-createdAt');

    // Count total before pagination
    const total = await Note.countDocuments(search ? {
      ...filter,
      $or: [
        { title: new RegExp(search, 'i') },
        { subject: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ]
    } : filter);

    // Pagination
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;
    query = query.skip(skip).limit(limitNum);

    const notes = await query;

    res.json({
      success: true,
      count: notes.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      notes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single note
// @route   GET /api/notes/:id
const getNoteById = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('author', 'name avatar branch year college contributionScore badges')
      .populate('ratings.user', 'name avatar');

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.status !== 'approved' && (!req.user || (req.user._id.toString() !== note.author._id.toString() && req.user.role !== 'admin'))) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Increment view count
    await Note.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload a note
// @route   POST /api/notes
const uploadNote = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { title, description, subject, branch, year, semester, unit, category, tags, faculty, college, university, isExamImportant } = req.body;

    // Determine file type
    const ext = req.file.originalname.split('.').pop().toLowerCase();
    const fileTypeMap = {
      pdf: 'pdf', docx: 'docx', doc: 'doc',
      pptx: 'pptx', ppt: 'ppt',
      jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
      zip: 'zip'
    };

    const note = await Note.create({
      title,
      description,
      subject,
      branch,
      year,
      semester: parseInt(semester),
      unit,
      category,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      fileUrl: req.file.path,
      filePublicId: req.file.filename,
      fileType: fileTypeMap[ext] || 'other',
      fileSize: req.file.size,
      faculty,
      college,
      university,
      isExamImportant: isExamImportant === 'true',
      author: req.user._id,
      status: req.user.role === 'admin' || req.user.role === 'faculty' ? 'approved' : 'pending'
    });

    // Update user upload count and contribution score
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { uploadCount: 1, contributionScore: 10 }
    });

    // Check for badge awards
    const user = await User.findById(req.user._id);
    await checkAndAwardBadges(user);

    res.status(201).json({
      success: true,
      message: note.status === 'approved' ? 'Note uploaded successfully!' : 'Note submitted for review!',
      note
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
const updateNote = async (req, res, next) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this note' });
    }

    const allowedFields = ['title', 'description', 'subject', 'unit', 'tags', 'faculty', 'isExamImportant'];
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // If note was rejected, allow resubmission
    if (note.status === 'rejected') {
      updates.status = 'pending';
      updates.rejectionReason = undefined;
    }

    note = await Note.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    res.json({ success: true, note });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
const deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Delete from Cloudinary
    if (note.filePublicId) {
      await deleteFromCloudinary(note.filePublicId, note.fileType === 'image' ? 'image' : 'raw');
    }

    await note.deleteOne();

    // Update user stats
    await User.findByIdAndUpdate(note.author, {
      $inc: { uploadCount: -1, contributionScore: -10 }
    });

    res.json({ success: true, message: 'Note deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment download count
// @route   POST /api/notes/:id/download
const downloadNote = async (req, res, next) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { downloadCount: 1 } });
      // Award contribution to note author
      await User.findByIdAndUpdate(note.author, { $inc: { contributionScore: 1 } });
    }

    res.json({ 
      success: true, 
      fileUrl: note.fileUrl,
      fileType: note.fileType,
      title: note.title
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Rate a note
// @route   POST /api/notes/:id/rate
const rateNote = async (req, res, next) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    // Check if already rated
    const existingRatingIndex = note.ratings.findIndex(r => r.user.toString() === req.user._id.toString());

    if (existingRatingIndex > -1) {
      note.ratings[existingRatingIndex].rating = rating;
      note.ratings[existingRatingIndex].review = review;
    } else {
      note.ratings.push({ user: req.user._id, rating, review });
    }

    await note.save();

    res.json({
      success: true,
      message: 'Rating submitted',
      averageRating: note.averageRating,
      ratingCount: note.ratingCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bookmark/unbookmark a note
// @route   POST /api/notes/:id/bookmark
const bookmarkNote = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const noteId = req.params.id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ success: false, message: 'Note not found' });
    }

    const isBookmarked = user.bookmarks.includes(noteId);

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== noteId);
      await Note.findByIdAndUpdate(noteId, { $inc: { bookmarkCount: -1 } });
    } else {
      user.bookmarks.push(noteId);
      await Note.findByIdAndUpdate(noteId, { $inc: { bookmarkCount: 1 } });
    }

    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      isBookmarked: !isBookmarked,
      message: isBookmarked ? 'Bookmark removed' : 'Note bookmarked'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get notes by current user
// @route   GET /api/notes/my-notes
const getMyNotes = async (req, res, next) => {
  try {
    const { status, page, limit } = req.query;
    const filter = { author: req.user._id };
    if (status) filter.status = status;

    const total = await Note.countDocuments(filter);
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const notes = await Note.find(filter)
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({ success: true, count: notes.length, total, notes });
  } catch (error) {
    next(error);
  }
};

// Helper: Check and award badges
const checkAndAwardBadges = async (user) => {
  const badgeDefinitions = [
    { name: 'First Upload', icon: '📝', condition: () => user.uploadCount >= 1 },
    { name: 'Note Contributor', icon: '⭐', condition: () => user.uploadCount >= 5 },
    { name: 'Top Contributor', icon: '🏆', condition: () => user.uploadCount >= 20 },
    { name: 'Scholar', icon: '🎓', condition: () => user.contributionScore >= 100 },
    { name: 'Download Champion', icon: '📥', condition: () => user.downloadCount >= 50 },
  ];

  const existingBadgeNames = user.badges.map(b => b.name);
  let newBadges = false;

  for (const badge of badgeDefinitions) {
    if (badge.condition() && !existingBadgeNames.includes(badge.name)) {
      user.badges.push({ name: badge.name, icon: badge.icon });
      newBadges = true;
    }
  }

  if (newBadges) {
    await user.save({ validateBeforeSave: false });
  }
};

module.exports = {
  getNotes, getNoteById, uploadNote, updateNote,
  deleteNote, downloadNote, rateNote, bookmarkNote, getMyNotes
};
