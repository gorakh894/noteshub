const express = require('express');
const router = express.Router();
const {
  getStats, getUsers, updateUser, getPendingNotes,
  approveNote, rejectNote, deleteNote, featureNote, approvePaper
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require auth + admin/coordinator role
router.use(protect);
router.use(authorize('admin', 'coordinator'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.get('/notes/pending', getPendingNotes);
router.put('/notes/:id/approve', approveNote);
router.put('/notes/:id/reject', rejectNote);
router.delete('/notes/:id', deleteNote);
router.put('/notes/:id/feature', featureNote);
router.put('/papers/:id/approve', approvePaper);

module.exports = router;
