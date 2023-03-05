const Sequelize = require('sequelize');
const sequelize = require('../../util/database');
const DoctorFreeTime = sequelize.define('doctorFreeTime', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	day: {
		type: Sequelize.STRING,
		allowNull: false
	},
	fromHour: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	toHour: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	expectHours: {
		type: Sequelize.STRING,
		allowNull: true
	}
});

module.exports = DoctorFreeTime;
