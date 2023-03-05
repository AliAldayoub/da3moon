const Sequelize = require('sequelize');
const sequelize = require('../../util/database');
const AppointmentDate = sequelize.define('appointmentDate', {
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
	hour: {
		type: Sequelize.INTEGER,
		allowNull: false
	}
});

module.exports = AppointmentDate;
