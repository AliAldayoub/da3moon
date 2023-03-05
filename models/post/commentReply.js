const Sequelize = require('sequelize');
const sequelize = require('../../util/database');
const CommentReply = sequelize.define('commentReply', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	reply: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = CommentReply;
