const Discussion = require('../models/Discussion');
const User = require('../models/User');

// @desc    Get all discussions
// @route   GET /api/discussions
const getDiscussions = async (req, res, next) => {
  try {
    const { branch, semester, category, search, sort, page, limit } = req.query;

    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = parseInt(semester);
    if (category) filter.category = category;

    if (search) {
      const regex = new RegExp(search, 'i');
      filter.$or = [{ title: regex }, { content: regex }, { tags: regex }];
    }

    const total = await Discussion.countDocuments(filter);
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const sortOptions = {
      newest: '-createdAt',
      oldest: 'createdAt',
      most_answers: '-answerCount',
      most_views: '-views',
      trending: '-upvotes',
    };

    const discussions = await Discussion.find(filter)
      .populate('author', 'name avatar branch year role')
      .sort(sortOptions[sort] || '-createdAt')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .select('-answers');

    res.json({
      success: true,
      count: discussions.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      discussions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single discussion
// @route   GET /api/discussions/:id
const getDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('author', 'name avatar branch year role contributionScore badges')
      .populate('answers.author', 'name avatar branch year role');

    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    res.json({ success: true, discussion });
  } catch (error) {
    next(error);
  }
};

// @desc    Create discussion
// @route   POST /api/discussions
const createDiscussion = async (req, res, next) => {
  try {
    const { title, content, subject, branch, semester, tags, category } = req.body;

    const discussion = await Discussion.create({
      title, content, subject, branch,
      semester: semester ? parseInt(semester) : undefined,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : [],
      category: category || 'Question',
      author: req.user._id
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { contributionScore: 5 } });

    const populated = await discussion.populate('author', 'name avatar branch year');

    res.status(201).json({ success: true, discussion: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Add answer to discussion
// @route   POST /api/discussions/:id/answers
const addAnswer = async (req, res, next) => {
  try {
    const { content } = req.body;

    const discussion = await Discussion.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          answers: {
            author: req.user._id,
            content
          }
        }
      },
      { new: true }
    ).populate('answers.author', 'name avatar branch year role');

    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    await User.findByIdAndUpdate(req.user._id, { $inc: { contributionScore: 3 } });

    const newAnswer = discussion.answers[discussion.answers.length - 1];

    res.status(201).json({ success: true, answer: newAnswer });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on an answer
// @route   POST /api/discussions/:id/answers/:answerId/vote
const voteAnswer = async (req, res, next) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    const { id, answerId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(id);
    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    const answer = discussion.answers.id(answerId);
    if (!answer) {
      return res.status(404).json({ success: false, message: 'Answer not found' });
    }

    const hasUpvoted = answer.upvotes.includes(userId);
    const hasDownvoted = answer.downvotes.includes(userId);

    if (vote === 'up') {
      if (hasUpvoted) {
        answer.upvotes.pull(userId);
      } else {
        answer.upvotes.push(userId);
        if (hasDownvoted) answer.downvotes.pull(userId);
      }
    } else if (vote === 'down') {
      if (hasDownvoted) {
        answer.downvotes.pull(userId);
      } else {
        answer.downvotes.push(userId);
        if (hasUpvoted) answer.upvotes.pull(userId);
      }
    }

    await discussion.save();

    res.json({
      success: true,
      upvotes: answer.upvotes.length,
      downvotes: answer.downvotes.length,
      voteCount: answer.upvotes.length - answer.downvotes.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Vote on discussion
// @route   POST /api/discussions/:id/vote
const voteDiscussion = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    const hasVoted = discussion.upvotes.includes(userId);
    if (hasVoted) {
      discussion.upvotes.pull(userId);
    } else {
      discussion.upvotes.push(userId);
    }

    await discussion.save();

    res.json({ success: true, upvotes: discussion.upvotes.length, hasVoted: !hasVoted });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark answer as accepted
// @route   PUT /api/discussions/:id/answers/:answerId/accept
const acceptAnswer = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    if (discussion.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the question author can accept answers' });
    }

    // Unaccept previous accepted answer
    discussion.answers.forEach(a => { a.isAccepted = false; });

    const answer = discussion.answers.id(req.params.answerId);
    if (answer) {
      answer.isAccepted = true;
      discussion.isResolved = true;
    }

    await discussion.save();

    res.json({ success: true, message: 'Answer accepted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete discussion
// @route   DELETE /api/discussions/:id
const deleteDiscussion = async (req, res, next) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ success: false, message: 'Discussion not found' });
    }

    if (discussion.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await discussion.deleteOne();

    res.json({ success: true, message: 'Discussion deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDiscussions, getDiscussion, createDiscussion, addAnswer,
  voteAnswer, voteDiscussion, acceptAnswer, deleteDiscussion
};
