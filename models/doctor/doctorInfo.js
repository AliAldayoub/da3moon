const Sequelize = require('sequelize');
const sequelize = require('../../util/database');
const DoctorInfo = sequelize.define('doctorInfo', {
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		allowNull: false,
		primaryKey: true
	},
	desc: {
		type: Sequelize.STRING,
		allowNull: false
	},
	specialist: {
		type: Sequelize.STRING,
		allowNull: false
	},
	experienceYears: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	price: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	phoneNumber: {
		type: Sequelize.INTEGER,
		allowNull: false
	},
	doctorFile: {
		type: Sequelize.STRING,
		allowNull: false
	},
	doctorCv: {
		type: Sequelize.STRING,
		allowNull: false
	},
	doctorImage: {
		type: Sequelize.STRING,
		allowNull: false
	},
	loves: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0
	}
	// days: {
	// 	type: Sequelize.STRING,
	// 	allowNull: false,
	// 	get() {
	// 		return this.getDataValue('days').split(';')
	// 	},
	// 	set(val) {
	// 	   this.setDataValue('days',val);
	// 	},
	// }
});

module.exports = DoctorInfo;
