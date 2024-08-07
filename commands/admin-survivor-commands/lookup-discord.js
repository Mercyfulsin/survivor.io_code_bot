const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const SurvivorId = require('../../database/models/survivorId');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lookup-discord-id')
        .setDescription('Given a discord ID, pull the Survivor ID.')
        .addStringOption((option) =>
            option
                .setName('discord-id')
                .setDescription('Discord ID to lookup.')
                .setRequired(true),
        ),
    async execute(interaction) {
        if (interaction.member.permissions.has(PermissionFlagsBits.MuteMembers)) {
            const survivorId = await SurvivorId.findOne({ where: { id: interaction.options.getString('discord-id') } });
            if (survivorId) {
                await interaction.reply(`Survivor ID: ${survivorId.survivorId}`);
            }
            else {
                await interaction.reply('No ID was found!');
            }
        }
    },
};