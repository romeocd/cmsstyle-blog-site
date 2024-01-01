const express = require('express');
const { addComment, deleteComment } = require('../controllers/commentController');
const router = express.Router();

router.post('/:postId', addComment);    // Add a comment to a post
router.delete('/:commentId', deleteComment); // Delete a comment

module.exports = router;