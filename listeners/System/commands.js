const { Events, ChatInputCommandInteraction, Client } = require("discord.js");
const { BOT_PERMISSIONS } = require("../../structure/ENUMS");
const Embed = require("../../structure/Embed");
const lunix = require("../../schemas/lunix");

module.exports = {
    name: Events.InteractionCreate,
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);

        const lunixDB = await lunix.findOne({});

        if (command.botPermission === BOT_PERMISSIONS.DISABLED)
            return interaction.reply({
                embeds: [Embed().setDescription("Эта команда отключена.")],
                ephemeral: true,
            });
        if (
            command.botPermission === BOT_PERMISSIONS.DEVELOPER &&
            !lunixDB.DEVELOPERS.includes(interaction.user.id)
        )
            return interaction.reply({
                embeds: [
                    Embed().setDescription(
                        "Эта команда доступна только для разработчиков."
                    ),
                ],
                ephemeral: true,
            });
        if (
            command.botPermission === BOT_PERMISSIONS.BETA &&
            (!lunixDB.BETA_USERS.includes(interaction.user.id) &&
                !lunixDB.DEVELOPERS.includes(interaction.user.id))
        )
            return interaction.reply({
                embeds: [
                    Embed().setDescription(
                        "Эта команда доступна только для бета-пользователей."
                    ),
                ],
                ephemeral: true,
            });

        if (command.botPermission === BOT_PERMISSIONS.BOOST && !interaction.member.roles.cache.some((v) => v.id === interaction.guild.roles.premiumSubscriberRole.id))
            return interaction.reply({
                embeds: [
                    Embed().setDescription(
                        `Эта команда доступна только для пользователей с ролью ${interaction.guild.roles.premiumSubscriberRole}.`
                    ),
                ],
                ephemeral: true,
            });
        await command.execute(interaction, client);
        Log.send(
            `[COMMANDS/${interaction.commandName.toUpperCase()}] ${interaction.member} (${interaction.user.tag}) used /${interaction.commandName
            } ${interaction.options.data.length > 0
                ? `with options [${interaction.options.data.map((v) => {
                    return `${v.name}: ${v.value}`;
                })}]`
                : ""
            }`
        );
    },
};
