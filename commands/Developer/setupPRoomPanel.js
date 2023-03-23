const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Embed = require("../../structure/Embed");
const { BOT_PERMISSIONS, COMMANDS_OPTIONS } = require("../../structure/ENUMS");

const command = {
    name: "setup-prp",
    description: "Setup PRP",
    botPermissions: BOT_PERMISSIONS.DEVELOPER,
    options: [
        {
            type: COMMANDS_OPTIONS.CHANNEL_OPTION,
            name: "channel",
            description: "Channel to setup PRP in",
            required: true
        }
    ],
    async execute(interaction) {
        const channel = interaction.options.getChannel("channel", true);
        if (!channel) return interaction.reply({ content: "Channel not found", ephemeral: true });

        await channel.send({
            embeds: [
                Embed().setTimestamp(null).setDescription("test")
            ], 
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId("proom-name").setLabel("Name").setStyle(ButtonStyle.Secondary),
                )
            ]
        })
        await interaction.reply({ content: `Private rooms panel linked to ${channel}`, ephemeral: true });
    }
}

module.exports = command;