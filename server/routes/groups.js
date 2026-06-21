const express = require('express');
const router = express.Router();
const { getGroups, getGroup, createGroup, joinGroup, leaveGroup, shareNote, getMyGroups } = require('../controllers/groupController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getGroups);
router.get('/my-groups', protect, getMyGroups);
router.get('/:id', protect, getGroup);
router.post('/', protect, createGroup);
router.post('/:id/join', protect, joinGroup);
router.delete('/:id/leave', protect, leaveGroup);
router.post('/:id/share', protect, shareNote);

module.exports = router;
