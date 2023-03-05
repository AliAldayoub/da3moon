const Sequelize = require('sequelize');
const sequelize = require('../../util/database');

const TextMessage = sequelize.define('textMessage', {
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
	text: {
		type: Sequelize.STRING,
		allowNull: false
	}
});

module.exports = TextMessage;
