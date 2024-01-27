const { SlashCommandBuilder } = require('discord.js');
const CodeTable = require('../../database/models/codeTable');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-code')
		.setDescription('Get latest code in our DB.'),

	async execute(interaction) {

		const currentCode = await CodeTable.findOne({ order: [ [ 'createdAt', 'DESC' ]] });

		await interaction.reply(`The latest code is: ${currentCode.code}`);
	},
};