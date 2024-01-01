const router = require('express');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all posts
router.get('/', (req, res) => {
  Post.findAll({
      attributes: ['id', 'title', 'content', 'created_at'],
      order: [['created_at', 'DESC']],
      include: [
          {
              model: User,
              attributes: ['username']
          },
          {
              model: Comment,
              attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
              include: {
                  model: User,
                  attributes: ['username']
              }
          }
      ]
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
      console.log(err);
      res.status(500).json(err);
  });
});

// Get a single Post by ID
router.get('/:id', (req,res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'content', 'title', 'created_at'],
    include: [
      {
        model: User, 
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  })
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json({ message: 'No Post found with this id' });
      return;
    }
    res.json(dbPostData)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


//Update a post
router.put('/:id', withAuth, (req,res) => {
  Post.update({
    title: req.body.title,
    content: req.body.content,
  }, {
    where: {
      id: req.params.id
    }
  })
  .then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({ message: 'No Post found with this id' });
      return;
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

//Delete a Post
router.delete('/:id', withAuth, (req,res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({ message: 'No Post found with this id' });
      return;
    }
    res.json(dbPostData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;