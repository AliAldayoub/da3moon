const Sequelize = require('sequelize');
const sequelize = require('../../util/database');
const PostImage = sequelize.define('postImage', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	image: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = PostImage;
