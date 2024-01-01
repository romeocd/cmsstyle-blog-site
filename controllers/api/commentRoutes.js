const router = require('express').Router();
const { Comment } = require('../../models')
const withAuth = require('../../utils/auth');

// Get all comments
router.get('/', (req, res) => {
    Comment.findAll({})
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Get a single comment by id
router.get('/:id', (req, res) => {
    Comment.findByPk(req.params.id)
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json(dbCommentData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Create a new comment
router.post('/', withAuth, (req, res) => {
    if (req.session && req.body.comment_text && req.body.post_id) {
        Comment.create({
            comment_text: req.body.comment_text,
            post_id: req.body.post_id,
            user_id: req.session.user_id,
        })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    } else {
        res.status(401).json({ message: 'Not authorized or invalid data!' });
    }
});

// Update a comment
router.put('/:id', withAuth, (req, res) => {
    if (req.body.comment_text) {
        Comment.update({
            comment_text: req.body.comment_text
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(dbCommentData => {
            if (!dbCommentData[0]) {
                res.status(404).json({ message: 'No comment found with this id' });
                return;
            }
            res.json({ message: 'Comment updated successfully' });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    } else {
        res.status(400).json({ message: 'Invalid comment data' });
    }
});

// Delete a comment
router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbCommentData => {
        if (!dbCommentData) {
            res.status(404).json({ message: 'No comment found with this id' });
            return;
        }
        res.json({ message: 'Comment deleted successfully' });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;