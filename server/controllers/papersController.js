const QuestionPaper = require('../models/QuestionPaper');
const User = require('../models/User');
const { deleteFromCloudinary } = require('../config/cloudinary');

// @desc    Get all question papers
// @route   GET /api/papers
const getPapers = async (req, res, next) => {
  try {
    const { branch, year, semester, subject, examYear, university, search, sort, page, limit } = req.query;

    const filter = { status: 'approved' };
    if (branch) filter.branch = branch;
    if (year) filter.year = year;
    if (semester) filter.semester = parseInt(semester);
    if (examYear) filter.examYear = parseInt(examYear);
    if (university) filter.university = new RegExp(university, 'i');

    if (search || subject) {
      const term = search || subject;
      filter.subject = new RegExp(term, 'i');
    }

    const total = await QuestionPaper.countDocuments(filter);
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;

    const papers = await QuestionPaper.find(filter)
      .populate('author', 'name avatar')
      .sort(sort === 'oldest' ? 'examYear' : '-examYear')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    // Group by subject for better UX
    const grouped = {};
    papers.forEach(paper => {
      if (!grouped[paper.subject]) grouped[paper.subject] = [];
      grouped[paper.subject].push(paper);
    });

    res.json({
      success: true,
      count: papers.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      papers,
      grouped
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single paper
// @route   GET /api/papers/:id
const getPaper = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('author', 'name avatar');

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Question paper not found' });
    }

    res.json({ success: true, paper });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload question paper
// @route   POST /api/papers
const uploadPaper = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { subject, branch, year, semester, examYear, examMonth, university } = req.body;

    const paper = await QuestionPaper.create({
      subject,
      branch,
      year,
      semester: parseInt(semester),
      examYear: parseInt(examYear),
      examMonth,
      university: university || 'SPPU',
      fileUrl: req.file.path,
      filePublicId: req.file.filename,
      author: req.user._id,
      status: req.user.role === 'admin' || req.user.role === 'faculty' ? 'approved' : 'pending'
    });

    await User.findByIdAndUpdate(req.user._id, { $inc: { contributionScore: 15 } });

    res.status(201).json({
      success: true,
      message: paper.status === 'approved' ? 'Paper uploaded!' : 'Paper submitted for review',
      paper
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download paper (increment count)
// @route   POST /api/papers/:id/download
const downloadPaper = async (req, res, next) => {
  try {
    const paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    res.json({ 
      success: true, 
      fileUrl: paper.fileUrl,
      fileType: paper.fileType,
      subject: paper.subject,
      year: paper.year,
      semester: paper.semester
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload solution for paper
// @route   PUT /api/papers/:id/solution
const uploadSolution = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a solution file' });
    }

    const paper = await QuestionPaper.findByIdAndUpdate(
      req.params.id,
      {
        solutionUrl: req.file.path,
        solutionPublicId: req.file.filename
      },
      { new: true }
    );

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found' });
    }

    await User.findByIdAndUpdate(req.user._id, { $inc: { contributionScore: 20 } });

    res.json({ success: true, message: 'Solution uploaded!', paper });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unique subjects for a branch/semester
// @route   GET /api/papers/subjects
const getSubjects = async (req, res, next) => {
  try {
    const { branch, semester } = req.query;
    const filter = { status: 'approved' };
    if (branch) filter.branch = branch;
    if (semester) filter.semester = parseInt(semester);

    const subjects = await QuestionPaper.distinct('subject', filter);
    res.json({ success: true, subjects: subjects.sort() });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPapers, getPaper, uploadPaper, downloadPaper, uploadSolution, getSubjects };
