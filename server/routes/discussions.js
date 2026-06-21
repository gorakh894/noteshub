const express = require('express');
const router = express.Router();
const {
  getDiscussions, getDiscussion, createDiscussion, addAnswer,
  voteAnswer, voteDiscussion, acceptAnswer, deleteDiscussion
} = require('../controllers/discussionController');
const { protect, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, getDiscussions);
router.get('/:id', optionalAuth, getDiscussion);
router.post('/', protect, createDiscussion);
router.delete('/:id', protect, deleteDiscussion);
router.post('/:id/vote', protect, voteDiscussion);
router.post('/:id/answers', protect, addAnswer);
router.post('/:id/answers/:answerId/vote', protect, voteAnswer);
router.put('/:id/answers/:answerId/accept', protect, acceptAnswer);

module.exports = router;
