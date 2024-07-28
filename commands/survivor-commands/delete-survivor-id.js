const { SlashCommandBuilder } = require('discord.js');
const SurvivorId = require('../../database/models/survivorId');
const { CODE_ROLE } = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete-survivor-id')
		.setDescription('Delete your Survivor ID from the DB!'),

	async execute(interaction) {
		const discord_id = interaction.member.id;

		const survivorId = await SurvivorId.destroy({ where: { id: discord_id } });
		if (survivorId) {
            await interaction.member.roles.remove(CODE_ROLE);
			await interaction.reply(`Your ID has been deleted from the database and role removed!`);
		}
		else {
			await interaction.reply('No ID was found!');
		}

	},
};