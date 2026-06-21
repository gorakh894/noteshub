const express = require('express');
const router = express.Router();
const {
  getNotes, getNoteById, uploadNote, updateNote,
  deleteNote, downloadNote, rateNote, bookmarkNote, getMyNotes
} = require('../controllers/notesController');
const { protect, optionalAuth } = require('../middleware/auth');
const { uploadNote: uploadMiddleware } = require('../config/cloudinary');

router.get('/', optionalAuth, getNotes);
router.get('/my-notes', protect, getMyNotes);
router.get('/:id', optionalAuth, getNoteById);
router.post('/', protect, uploadMiddleware.single('file'), uploadNote);
router.put('/:id', protect, updateNote);
router.delete('/:id', protect, deleteNote);
router.post('/:id/download', optionalAuth, downloadNote);
router.post('/:id/rate', protect, rateNote);
router.post('/:id/bookmark', protect, bookmarkNote);

module.exports = router;
