const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const SurvivorId = require('../../database/models/survivorId');


module.exports = {
	data: {
		name: 'redeem-code',
	},
	async execute(interaction) {
		const discord_id = interaction.member.id;
		const survivorId = await SurvivorId.findOne({
			where: { id: discord_id },
		});
		const code = interaction.message.content.slice(17);
		if (!survivorId) {
			interaction.reply(
				`${interaction.user.tag} Please use /set-survivor-id !`,
			);
		}
		else {
			/* #region Fetch Captcha Creation */
			let captchaURL;
			try {
				const captcha = await fetch(
					'https://mail.survivorio.com/api/v1/captcha/generate',
					{
						headers: {
							accept: 'application/json, text/plain, */*',
							'accept-language':
			'en-US,en;q=0.9,es-US;q=0.8,es;q=0.7,uk;q=0.6',
							'sec-ch-ua':
			'"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
							'sec-ch-ua-mobile': '?0',
							'sec-ch-ua-platform': '"Windows"',
							'sec-fetch-dest': 'empty',
							'sec-fetch-mode': 'cors',
							'sec-fetch-site': 'same-site',
							Referer: 'https://gift.survivorio.com/',
							'Referrer-Policy': 'strict-origin-when-cross-origin',
						},
						body: null,
						method: 'POST',
					},
				);
				const data = await captcha.json();
				await survivorId.update({ latestCaptcha: data.data.captchaId });
				captchaURL =
	  'https://mail.survivorio.com/api/v1/captcha/image/' +
	  data.data.captchaId;
			}
			catch (error) {
				await interaction.reply('Oops, error detected');
				console.log(error);
			}
			const embed = new EmbedBuilder()
				.setTitle('Solve Captcha')
				.setDescription('Please solve Captcha to continue!')
				.addFields({ name: 'Code', value: code, inline: true })
				.setImage(captchaURL);
			const solve = new ButtonBuilder()
				.setCustomId('submit-captcha')
				.setLabel('Solve Captcha')
				.setStyle(1);
			const row = new ActionRowBuilder().addComponents(solve);
			await interaction.reply({
				embeds: [embed],
				components: [row],
				ephemeral: true,
			}).then((sentMessage) => {
				setTimeout(() => {
					sentMessage.delete();
				}, 10000);
			});

			/* #endregion */
		}

	},
};

