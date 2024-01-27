const { SlashCommandBuilder } = require('discord.js');
const SurvivorId = require('../../database/models/survivorId');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-survivor-id')
		.setDescription('Set your Survivor ID!')
		.addIntegerOption(option => option
			.setName('id')
			.setDescription('Your Survivor ID is required')
			.setRequired(true),
		),

	async execute(interaction) {
		const discord_id = interaction.member.id;
		const id = await interaction.options.getInteger('id');

		const [ survivorId, created ] = await SurvivorId.findOrCreate({ where: { id: interaction.member.id } });
		await survivorId.update({ survivorId: id });
		await interaction.reply(`User ${discord_id} has assigned Survivor ID: ${id}`);
	},
};