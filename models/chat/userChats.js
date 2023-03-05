const Sequelize = require('sequelize');
const sequelize = require('../../util/database');
const userChats = sequelize.define('User_Chat', {});

module.exports = userChats;
