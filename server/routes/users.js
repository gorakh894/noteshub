const express = require('express');
const router = express.Router();
const { getUserProfile, updateProfile, updateAvatar, changePassword, getBookmarks, followUser, getLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadAvatar } = require('../config/cloudinary');

router.get('/leaderboard', getLeaderboard);
router.get('/bookmarks', protect, getBookmarks);
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, uploadAvatar.single('avatar'), updateAvatar);
router.put('/change-password', protect, changePassword);
router.post('/:id/follow', protect, followUser);

module.exports = router;
