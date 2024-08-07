const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const SurvivorId = require('../../database/models/survivorId');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('prune-users')
		.setDescription('Deletes users who are no longer in the server.'),
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
			const members = await interaction.guild.members.fetch();
			const memberIds = members.map(member => member.id);
			const records = await SurvivorId.findAll();
			const orphanedRecords = records.filter(record => !memberIds.includes(record.id));

			for (const orphanedRecord of orphanedRecords) {
				await orphanedRecord.destroy();
				console.log(`Destroyed ${orphanedRecord.id} with Survivor ID ${orphanedRecord.survivorId}`);
			}
			await interaction.reply('Pruned users from DB. Check console for details.');
		}
		else {
			await interaction.reply('Not Admin');
		}
	},
};