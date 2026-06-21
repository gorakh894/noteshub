const StudyGroup = require('../models/StudyGroup');
const User = require('../models/User');
const crypto = require('crypto');

// @desc    Get all study groups
// @route   GET /api/groups
const getGroups = async (req, res, next) => {
  try {
    const { branch, semester, search, page, limit } = req.query;

    const filter = { isPrivate: false };
    if (branch) filter.branch = branch;
    if (semester) filter.semester = parseInt(semester);
    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ name: regex }, { description: regex }, { subject: regex }];
    }

    const total = await StudyGroup.countDocuments(filter);
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;

    const groups = await StudyGroup.find(filter)
      .populate('creator', 'name avatar')
      .populate('members.user', 'name avatar')
      .sort('-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('-messages');

    res.json({ success: true, count: groups.length, total, totalPages: Math.ceil(total / limitNum), groups });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single group with messages
// @route   GET /api/groups/:id
const getGroup = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id)
      .populate('creator', 'name avatar')
      .populate('members.user', 'name avatar branch year')
      .populate('sharedResources.note', 'title subject category fileType')
      .populate('sharedResources.sharedBy', 'name avatar')
      .populate('messages.sender', 'name avatar');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is a member for private groups
    if (group.isPrivate) {
      const isMember = group.members.some(m => m.user._id.toString() === req.user._id.toString());
      if (!isMember && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'This is a private group' });
      }
    }

    res.json({ success: true, group });
  } catch (error) {
    next(error);
  }
};

// @desc    Create study group
// @route   POST /api/groups
const createGroup = async (req, res, next) => {
  try {
    const { name, description, subject, branch, semester, isPrivate, maxMembers } = req.body;

    const inviteCode = isPrivate ? crypto.randomBytes(8).toString('hex') : undefined;

    const group = await StudyGroup.create({
      name,
      description,
      subject,
      branch,
      semester: semester ? parseInt(semester) : undefined,
      isPrivate: isPrivate === true || isPrivate === 'true',
      maxMembers: maxMembers || 50,
      inviteCode,
      creator: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    await group.populate('creator', 'name avatar');

    res.status(201).json({ success: true, group });
  } catch (error) {
    next(error);
  }
};

// @desc    Join group
// @route   POST /api/groups/:id/join
const joinGroup = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if private
    if (group.isPrivate) {
      if (req.body.inviteCode !== group.inviteCode) {
        return res.status(403).json({ success: false, message: 'Invalid invite code' });
      }
    }

    // Check max members
    if (group.members.length >= group.maxMembers) {
      return res.status(400).json({ success: false, message: 'Group is full' });
    }

    // Check if already a member
    const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
    if (isMember) {
      return res.status(400).json({ success: false, message: 'Already a member' });
    }

    group.members.push({ user: req.user._id, role: 'member' });
    await group.save();

    res.json({ success: true, message: 'Joined group successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave group
// @route   DELETE /api/groups/:id/leave
const leaveGroup = async (req, res, next) => {
  try {
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    if (group.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Creator cannot leave. Delete the group instead.' });
    }

    group.members = group.members.filter(m => m.user.toString() !== req.user._id.toString());
    await group.save();

    res.json({ success: true, message: 'Left group' });
  } catch (error) {
    next(error);
  }
};

// @desc    Share a note to group
// @route   POST /api/groups/:id/share
const shareNote = async (req, res, next) => {
  try {
    const { noteId } = req.body;
    const group = await StudyGroup.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    const isMember = group.members.some(m => m.user.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ success: false, message: 'You must be a member' });
    }

    group.sharedResources.push({ note: noteId, sharedBy: req.user._id });
    await group.save();

    res.json({ success: true, message: 'Note shared to group' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's groups
// @route   GET /api/groups/my-groups
const getMyGroups = async (req, res, next) => {
  try {
    const groups = await StudyGroup.find({ 'members.user': req.user._id })
      .populate('creator', 'name avatar')
      .sort('-createdAt')
      .select('-messages');

    res.json({ success: true, groups });
  } catch (error) {
    next(error);
  }
};

module.exports = { getGroups, getGroup, createGroup, joinGroup, leaveGroup, shareNote, getMyGroups };
