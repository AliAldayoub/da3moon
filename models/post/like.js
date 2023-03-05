const Sequelize = require('sequelize');
const sequelize = require('../../util/database');
const Like = sequelize.define('like', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	}
});

module.exports = Like;
