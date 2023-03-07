// const Sequelize = require('sequelize');

// const sequelize = new Sequelize(process.env.HOST_NAME, process.env.HOST_USERNAME, process.env.HOST_PASSWORD, {
// 	dialect: 'mysql',
// 	host: process.env.HOST,
// 	logging: false
// });

// module.exports = sequelize;

const Sequelize = require('sequelize');

const sequelize = new Sequelize('guide-me', 'root', 'alooshDy111234', {
	dialect: 'mysql',
	host: 'localhost',
	logging: false
});

module.exports = sequelize;
