const Sequelize = require('sequelize');

const sequelize = new Sequelize('sql7603031', 'sql7603031', '8V9V5m4Mce', {
	dialect: 'mysql',
	host: 'sql7.freemysqlhosting.net',
	logging: false
});

module.exports = sequelize;

// const Sequelize = require('sequelize');

// const sequelize = new Sequelize('guide-me', 'root', 'alooshDy111234', {
// 	dialect: 'mysql',
// 	host: 'localhost',
// 	logging: false
// });

// module.exports = sequelize;
