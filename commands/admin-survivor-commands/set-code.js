const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, ButtonBuilder, TextInputStyle, InteractionType, ActionRowBuilder } = require('discord.js');
const CodeTable = require('../../database/models/codeTable');
const SurvivorId = require('../../database/models/survivorId');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('set-code')
		.setDescription('Set the current code!')
		.addStringOption((option) =>
			option
				.setName('code')
				.setDescription('New code is required')
				.setRequired(true),
		),
	async execute(interaction) {
		if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
			const code_input = await interaction.options.getString('code');
			const [codeTable] = await CodeTable.findOrCreate({
				where: { code: code_input },
			});
			console.log(`Code Added by ${interaction.user.tag}!`);
			const confirm = new ButtonBuilder()
				.setCustomId('redeem-code')
				.setLabel(`🎁Redeem: ${codeTable.dataValues.code}!`)
				.setStyle(1);
			const row = new ActionRowBuilder().addComponents(confirm);

			await interaction.reply({
				content: `Reedem new code: ${codeTable.dataValues.code}`,
				components: [row],
			});
		}
		else {
			await interaction.reply('Not Admin');
		}
	},
};
