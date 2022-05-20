const User = require('./User.js');
const Post = require('./Post.js');

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id'
});

Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = {
    User,
    Post
};