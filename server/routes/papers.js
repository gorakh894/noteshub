const express = require('express');
const router = express.Router();
const { getPapers, getPaper, uploadPaper, downloadPaper, uploadSolution, getSubjects } = require('../controllers/papersController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadNote: uploadMiddleware } = require('../config/cloudinary');

router.get('/subjects', getSubjects);
router.get('/', optionalAuth, getPapers);
router.get('/:id', optionalAuth, getPaper);
router.post('/', protect, uploadMiddleware.single('file'), uploadPaper);
router.post('/:id/download', optionalAuth, downloadPaper);
router.put('/:id/solution', protect, uploadMiddleware.single('file'), uploadSolution);

module.exports = router;
