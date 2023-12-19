const Sequelize = require('sequelize');
const sequelize = require('../config/connection');

// Import models
const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// Define associations
User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id',
    onDelete: 'CASCADE'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// Export models and connection
module.exports = {
    sequelize,
    User,
    Post,
    Comment
};
