const Sequelize = require('sequelize');
const sequelize = require('../database');

const SurvivorId = sequelize.define('survivorId', {
	id: {
		type: Sequelize.STRING,
		primaryKey: true,
	},
	survivorId: {
		type: Sequelize.STRING,
	},
	latestCaptcha: {
		type: Sequelize.STRING,
	},
});

module.exports = SurvivorId;