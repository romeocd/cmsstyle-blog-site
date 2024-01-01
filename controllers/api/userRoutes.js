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
        attributes: {exclude: ['password'] },
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

// Create new User
router.post('/', (req, res) => {
    // Add validation for req.body here
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            res.json(dbUserData);
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//User login
router.post('/login', (req,res) => {
    User.findOne({
        where: {
            username: req.body.username
        }

    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user found with that username!' });
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect Password!' })
            return;
        }
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//User logout
router.post('/logout', (req,res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });

    } else {
        res.status(404).end();
    }
});

//Update a user
router.put('/:id', withAuth, (req,res) => {
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if(!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json({ message: 'User updated successfully' });

    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

router.delete('/:id', withAuth, (req,res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No User found with this id' });
            return;
        }
        res.json({ message: 'User deleted successfully' });
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err);
    });
});

module.exports = router;