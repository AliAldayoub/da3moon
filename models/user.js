const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	},
	status: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0
	},
	imageUrl: {
		type: Sequelize.STRING,
		allowNull: true,
		defaultValue: ''
	}
});

module.exports = User;
