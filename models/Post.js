const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js')

// create our Post model
class Post extends Model {
    static upvote (body, models) {
        return models.Vote.create({
            user_id: body.user_id, // similar to saying req.body.user_id... same for below
            post_id: body.post_id // req.body.post_id
        })
        .then(() => {
            return Post.findOne({
                where: {
                    id: body.post_id
                },
                attributes: [
                    'id',
                    'post_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

// create fields/columns for Post model... defining Post schema/table
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        },
        user_id: { // this is the foreign key
            type: DataTypes.INTEGER,
            references: { // ...by making this reference
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

module.exports = Post;