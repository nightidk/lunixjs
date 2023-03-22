const { ChatInputCommandInteraction } = require("discord.js");
const { BOT_PERMISSIONS, COMMANDS_OPTIONS } = require("../../structure/ENUMS");

const command = {
    name: "ping",
    description: "Pong?",
    botPermission: BOT_PERMISSIONS.DEFAULT,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.reply({
            content: "Pong!",
            ephemeral: true,
        });
    },
};

module.exports = command;
