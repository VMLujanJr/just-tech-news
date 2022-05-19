const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection.js')

// create our Post model
class Post extends Model {}

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