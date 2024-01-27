const { TextInputBuilder, ModalBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');

module.exports = {
	data: {
		name: 'submit-captcha',
	},
	async execute(interaction) {
		const code = interaction.message.embeds[0].data.fields[0].value;
		/* #region Modal Creation */
		const modal = new ModalBuilder()
			.setCustomId('redeem-modal')
			.setTitle('Solve Captcha');

		const codeInput = new TextInputBuilder()
			.setCustomId('codeInput')
			.setLabel('Survivor Code:')
			.setValue(code)
			.setStyle(TextInputStyle.Short);

		const captchaInput = new TextInputBuilder()
			.setCustomId('captchaInput')
			.setLabel('Enter Captcha code:')
			.setValue('')
			.setStyle(TextInputStyle.Short);

		const firstActionRow = new ActionRowBuilder().addComponents(
			captchaInput,
		);

		const secondActionRow = new ActionRowBuilder().addComponents(
			codeInput,
		);

		// Add inputs to the modal
		modal.addComponents(firstActionRow, secondActionRow);
		await interaction.showModal(modal);
		/* #endregion */

	},
};

