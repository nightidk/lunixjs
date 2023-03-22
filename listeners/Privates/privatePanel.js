const { ButtonInteraction } = require("discord.js");
const { getRoom } = require("../../structure/Database");
const Embed = require("../../structure/Embed");

module.exports = {
    name: "interactionCreate",
    checkOwner: (room, member) => {
        return room.owner === member.id;
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.isButton()) return;
        const type = interaction.customId.split("-")[0],
            action = interaction.customId.split("-")[1];
        if (type !== "proom") return;
        const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => { });
        if (!member) return;
        if (!member.voice || member.voice?.channel.parentId !== "975406530683867199")
            return interaction.editReply({
                embeds: [
                    Embed().setDescription("Вы не находитесь в приватной комнате!")
                ]
            });
        const room = await getRoom(member.channel.voice.id);
        if (!room) return interaction.editReply({
            embeds: [
                Embed().setDescription("Вы не находитесь в приватной комнате.")
            ]
        });

        switch (action) {
            case "name": {
                if (!this.checkOwner(room, member)) return await interaction.editReply({
                    embeds: [
                        Embed().setDescription("Вы не являетесь владельцем этой комнаты.")
                    ]
                });
                await interaction.editReply({
                    embeds: [
                        Embed().setDescription("Введите новое название комнаты.")
                    ]
                })
                const message = interaction.channel.createMessageCollector({ filter: (m) => m.author.id === member.id && m.channelId === interaction.channel.id });
                message.on("collect", async (m) => {
                    message.stop();
                    await member.voice.channel.setName(m.content).catch(() => {
                        return interaction.followUp({
                            embeds: [
                                Embed().setDescription("Не удалось изменить название комнаты.")
                            ]
                        })
                    })   
                    return await interaction.followUp({
                        embeds: [
                            Embed().setDescription("Название комнаты изменено.")
                        ]
                    });
                })
                
            }
        }
    }
}