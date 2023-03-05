const Sequelize = require('sequelize');
const sequelize = require('../../util/database');

const Chat = sequelize.define('chat', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	senderId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	reciverId: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	chatStatus: {
		type: Sequelize.BOOLEAN,
		defaultValue: false
	}
});

module.exports = Chat;
