const { ChatInputCommandInteraction } = require("discord.js");
const { getUser } = require("../../structure/Database");
const Embed = require("../../structure/Embed");
const { COMMANDS_OPTIONS } = require("../../structure/ENUMS");

const command = {
    name: "balance",
    description: "Проверка баланса пользователя",
    options: [
        {
            type: COMMANDS_OPTIONS.USER_OPTION,
            name: "user",
            description: "Пользователь для проверки баланса",
            required: false
        }
    ],
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        await interaction.deferReply();
        const member = await interaction.guild.members.fetch({ user: interaction.options.getUser("user")?.id || interaction.user.id });
        const userDB = await getUser(member.id);
        
        await interaction.editReply({
            embeds: [
                Embed().setAuthor({ name: `Баланс — ${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) }).addFields(
                    [
                        {
                            name: "<a:bloodytear:1089583213388771479> Кровавые слёзы:",
                            value: `\`\`\`${userDB.balance.common}\`\`\``,
                            inline: true
                        },
                        {
                            name: "- Нет названия:",
                            value: `\`\`\`${userDB.balance.donate}\`\`\``,
                            inline: true
                        }
                    ]
                ).setFooter({ text: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            ]
        });
    }
}

module.exports = command;