const { ChatInputCommandInteraction, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const Embed = require("../../structure/Embed");
const { BOT_PERMISSIONS, COMMANDS_OPTIONS } = require("../../structure/ENUMS");

const commands = {
    name: 'setup-verify',
    description: "Setup a verification channel",
    botPermissions: BOT_PERMISSIONS.DEVELOPER,
    options: [
        {
            type: COMMANDS_OPTIONS.CHANNEL_OPTION,
            name: 'channel',
            description: 'The channel to verify',
            required: true
        }
    ],
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel', true);

        await interaction.reply({
            content: `${channel} has been set as the verification channel`,
            ephemeral: true
        });

        await channel.send({
            embeds: [
                Embed().setTimestamp(null).setAuthor({ name: "История начинается?.." }).setDescription(`Неужели ты тот самый путник, которого все так долго ждали? Стоп, ты же сейчас ничего не понимаешь, давай я тебе все объясню. Ты находишься сейчас мире под названием "Бездна", да-да, твои прекрасные глазки тебя не обманывают и ты все правильно прочитал. В данном пространстве есть определённые порядки и законы, которые помогут тебе остаться в этом загадочном месте.
                
Кстати, вот они: <#975299970041258054>. Обязательно прочти и запомни!
                
Если ты готов соблюдать их, то смело продолжай свой путь и разгадай тайны этого мира.
                
На случай если у тебя остались вопросы, то ты можешь задать их <@&974949220400369674>, они всегда помогут и защитят тебя в непредвиденных ситуациях.
Удачи, надеюсь, у тебя все получится и ты пройдешь все испытания и трудности на своем пути.`)
            ],
            components: [
                new ActionRowBuilder().addComponents(
                    new ButtonBuilder().setCustomId("verify").setLabel("Продолжить").setStyle(ButtonStyle.Success),
                )
            ]
        })
    }
}

module.exports = commands;