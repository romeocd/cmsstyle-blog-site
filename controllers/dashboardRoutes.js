const router = require('express').Router();
const { Post, User } = require('../models');
const withAuth = require('../utils/auth');

//Route to render the user's dashboard
router.get('/', withAuth, (req,res => {
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
router.get('/new', withAuth, (req,res) => {
    res.render('new-post', { loggedIn: true });
});

