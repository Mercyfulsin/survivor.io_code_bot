const {
	Events,
	InteractionType,
} = require('discord.js');
const SurvivorId = require('../database/models/survivorId');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const discord_id = interaction.member.id;
		const survivorId = await SurvivorId.findOne({
			where: { id: discord_id },
		});
		if (interaction.isChatInputCommand()) {
			const { commandName } = interaction;
			const command = interaction.client.commands.get(commandName);
			if (!command) {
				console.error(`No command matching ${commandName} was found.`);
				return;
			}
			try {
				console.log(`User ${interaction.user.tag} has used ${command.data.name}.`);
				await command.execute(interaction);
			}
			catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: 'There was an error while executing this command!',
						ephemeral: true,
					});
				}
				else {
					await interaction.reply({
						content: 'There was an error while executing this command!!',
						ephemeral: true,
					});
				}
			}
		}
		else if (interaction.isButton()) {
			const { customId } = interaction;
			const button = interaction.client.buttons.get(customId);
			if (!button) {
				console.error(`No button matching ${customId} was found.`);
				return;
			}
			try {
				console.log(`User ${interaction.user.tag} has pressed ${button.data.name}.`);
				await button.execute(interaction);
			}
			catch (error) {
				console.error(error);
				if (interaction.replied || interaction.deferred) {
					await interaction.followUp({
						content: 'There was an error while executing this button!',
						ephemeral: true,
					});
				}
				else {
					await interaction.reply({
						content: 'There was an error while executing this button!!',
						ephemeral: true,
					});
				}
			}
		}
		else if (interaction.type === InteractionType.ModalSubmit) {
			if (interaction.customId === 'redeem-modal') {
				const currentCode = interaction.fields.getTextInputValue('codeInput');
				const userInput = interaction.fields.getTextInputValue('captchaInput');
				const submitCode = await fetch(
					'https://mail.survivorio.com/api/v1/giftcode/claim',
					{
						headers: {
							accept: 'application/json, text/plain, */*',
							'content-type': 'application/json',
							'sec-fetch-dest': 'empty',
							'sec-fetch-mode': 'cors',
							'sec-fetch-site': 'same-site',
							Referer: 'https://gift.survivorio.com/',
							'Referrer-Policy': 'strict-origin-when-cross-origin',
						},
						body: `{"userId":"${survivorId.survivorId}","giftCode":"${currentCode}","captcha":"${userInput}","captchaId":"${survivorId.latestCaptcha}"}`,
						method: 'POST',
					},
				);
				const response = await submitCode.json();

				console.log(`${interaction.user.tag}:`);
				console.log(response);
				switch (response.code) {
				case 0:
					await interaction.reply({ content: 'Success!', ephemeral: true }).then((sentMessage) => {
						setTimeout(() => {
							sentMessage.delete();
						}, 3000);
					});
					break;
				case 20407:
					await interaction.reply({ content: `Error ${interaction.user.tag}: Already Claimed!`, ephemeral: true }).then((sentMessage) => {
						setTimeout(() => {
							sentMessage.delete();
						}, 3000);
					});
					break;
				case 20002:
					await interaction.reply({ content: `Error ${interaction.user.tag}: Wrong Captcha Code!`, ephemeral: true }).then((sentMessage) => {
						setTimeout(() => {
							sentMessage.delete();
						}, 3000);
					});
					break;
				case 20401:
					await interaction.reply({ content:`Error ${interaction.user.tag}: Giftcode Invalid!`, ephemeral: true }).then((sentMessage) => {
						setTimeout(() => {
							sentMessage.delete();
						}, 3000);
					});
					break;
				case 20003:
					await interaction.reply({ content:`Error ${interaction.user.tag}: UserID Invalid!`, ephemeral: true }).then((sentMessage) => {
						setTimeout(() => {
							sentMessage.delete();
						}, 3000);
					});
					break;
				default:
					await interaction.reply(
						`ERROR!!\nDebug: ID: ${survivorId.survivorId}, Captcha: ${survivorId.latestCaptcha}, Code: ${currentCode}, captchaCode: ${userInput}`,
					);
				}
			}
		}
		else if (interaction.isStringSelectMenu()) {
			console.log('Menu item selected!');
		}
	},
};
