const { SlashCommandBuilder } = require('discord.js');
const SurvivorId = require('../../database/models/survivorId');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-survivor-id')
		.setDescription('Get your Survivor ID!'),

	async execute(interaction) {
		const discord_id = interaction.member.id;

		const survivorId = await SurvivorId.findOne({ where: { id: discord_id } });
		if (survivorId) {
			await interaction.reply(`Your ID is: ${survivorId.survivorId}`);
		}
		else {
			await interaction.reply('No ID was found!');
		}

	},
};