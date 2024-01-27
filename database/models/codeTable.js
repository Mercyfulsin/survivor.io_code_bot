const Sequelize = require('sequelize');
const sequelize = require('../database');

const codeTable = sequelize.define('codeTable', {
	code: {
		type: Sequelize.STRING,
	},
});

module.exports = codeTable;