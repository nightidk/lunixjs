const { ButtonInteraction, Events } = require("discord.js");
const { getRoom } = require("../../structure/Database");
const Embed = require("../../structure/Embed");

module.exports = {
    name: Events.InteractionCreate,
    checkOwner: (room, member) => {
        return room.ownerId === member.id;
    },
    /**
     * 
     * @param {ButtonInteraction} interaction 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (!interaction.customId.startsWith("proom")) return;
        await interaction.deferReply({ ephemeral: true });
        const action = interaction.customId.split("-")[1];
        const member = await interaction.guild.members.fetch(interaction.user.id).catch(() => { });
        if (!member) return;
        if (!member.voice || member.voice?.channel.parentId !== "975406530683867199")
            return interaction.editReply({
                embeds: [
                    Embed().setDescription("Вы не находитесь в приватной комнате!")
                ]
            });
        const room = await getRoom(member.voice.channel.id);
        if (!room) return interaction.editReply({
            embeds: [
                Embed().setDescription("Вы не находитесь в приватной комнате.")
            ]
        });

        /* TODO: 
        actions: change limit, change owner, self owner, mute member (?), kick member, ban member,
        (un)lock room  
        */
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
                try {
                    const message = await interaction.channel.awaitMessages({ max: 1, filter: (m) => m.author.id === member.id && m.channelId === interaction.channel.id, time: 60000, errors: ["time"] });
                    member.voice.channel.setName(message.first().content).then(async () => {
                        await interaction.editReply({
                            embeds: [
                                Embed().setDescription("Название комнаты изменено.")
                            ]
                        })
                    }).catch(async () => {
                        await interaction.followUp({
                            embeds: [
                                Embed().setDescription("Не удалось изменить название комнаты.")
                            ]
                        })
                    })
                    await message.first().delete();
                } catch (_) {
                    await interaction.editReply({
                        embeds: [
                            Embed().setDescription("Время на ввод нового названия вышло.")
                        ]
                    })
                }
            } break;
        }
    }
}