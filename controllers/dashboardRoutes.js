const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

//Route to render the user's dashboard
router.get('/', withAuth, (req, res => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: ['id', 'title', 'content', 'created_at'],
        include: [
            {
                model: User,
                attributes:['username']
            }
        ]
    })
    .then(dbPostData => {
        const posts = dbPostData.map(post => post.get({ plain: true}));
        res.render('dashboard', { posts, loggedIn: true });
    })
    .catch(err => {
        console.log(err);
        res.statusCode(500).json(err);
    });
}));

//Route to render the form to add a new post
router.get('/new', withAuth, (req, res) => {
    res.render('new-post', { loggedIn: true });
});

//Route to render the form to edit an existing post
router.get('/edit:id', withAuth, (req, res) => {
    Post.findByPk(req.params.id)
    .then(dbPostData => {
        if (dbPostData) {
            const post = dbPostData.get({ plain: true });
            res.render('edit-post', { post, loggedIn: true });
        } else {
            res.status(404).json({ message: 'No post found with this id'});
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;