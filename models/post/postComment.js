const Sequelize = require('sequelize');
const sequelize = require('../../util/database');
const PostComment = sequelize.define('postComment', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	comment: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = PostComment;
