const router = require('express').Router();
const { User, Post, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//Get all users
router.get('/', (req,res) => {
    User.findAll({
        attributes: { exclude: ['Password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

//Get a single user by ID

router.get('/:id', (req,res) => {
    User.findOne({
        attributes: {exclude: ['Password'] },
        where: {
            id: req.params.id
        },
        include: [{ 
            model: Post,
            attributes: [
                'id',
                'title',
                'content',
                'created_at'
            ]
        },
        {
            model: Comment,
            attributes: [
                'id', 'comment_text', 'created_at'
            ],
            include: {
                model: Post,
                attributes: ['title']
            }
        },
        {
            model: Post,
            attributes: ['title'],
        }
    ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log (err);
        res.status(500).json(err);
    });
});