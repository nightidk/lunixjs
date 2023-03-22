const { ChatInputCommandInteraction, Client } = require("discord.js");
const Story = require("../../structure/Story");


const command = {
    name: "start",
    description: "Start story",
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        let story = new Story(client, interaction.user.id);

        await story.init();

        const storyEmbed = await story.getDialog().catch(async () => await interaction.editReply({ content: "Something went wrong while starting the story", ephemeral: true}));

        await interaction.editReply({ embeds: [storyEmbed], ephemeral: true });

    }
}

module.exports = command;