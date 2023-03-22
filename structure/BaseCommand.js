const { SlashCommandBuilder, Base, Client } = require("discord.js");
const { COMMANDS_OPTIONS, BOT_PERMISSIONS } = require("./ENUMS");

class BaseCommand {
    /**
     *
     * @param {String} name
     * @param {String} description
     * @param {Function} execute
     * @param {String} botPermission
     * @param {BigInt} permissions
     * @param {Array} options
     */
    constructor(
        name,
        description,
        execute,
        botPermission,
        permissions = null,
        options = [],
        dm = false
    ) {
        this.command = new SlashCommandBuilder()
            .setName(name)
            .setDescription(description)
            .setDMPermission(dm)
            .setDefaultMemberPermissions(permissions);
        options.forEach((v) => {
            switch (v.type) {
                case COMMANDS_OPTIONS.USER_OPTION:
                    {
                        this.command.addUserOption((option) =>
                            option
                                .setName(v.name)
                                .setDescription(v.description)
                                .setRequired(v.required ?? true)
                        );
                    }
                    break;
                case COMMANDS_OPTIONS.STRING_OPTION:
                    {
                        this.command.addStringOption((option) =>
                            option
                                .setName(v.name)
                                .setDescription(v.description)
                                .setRequired(v.required ?? true)
                        );
                    }
                    break;
                case COMMANDS_OPTIONS.INTEGER_OPTION:
                    {
                        this.command.addIntegerOption((option) =>
                            option
                                .setName(v.name)
                                .setDescription(v.description)
                                .setRequired(v.required ?? true)
                        );
                    }
                    break;
                case COMMANDS_OPTIONS.CHANNEL_OPTION:
                    {
                        this.command.addChannelOption((option) =>
                            option
                               .setName(v.name)
                               .setDescription(v.description)
                               .setRequired(v.required ?? true)
                        );
                    }
                    break;
                case COMMANDS_OPTIONS.ROLE_OPTION:
                    {
                        this.command.addRoleOption((option) =>
                            option
                              .setName(v.name)
                              .setDescription(v.description)
                              .setRequired(v.required ?? true)
                        );
                    }
                    break;
                case COMMANDS_OPTIONS.BOOLEAN_OPTION:
                    {
                        this.command.addBooleanOption((option) =>
                            option
                              .setName(v.name)
                              .setDescription(v.description)
                              .setRequired(v.required ?? true)
                        );
                    }
                    break;
            }
        });
        this.execute = execute;
        this.botPermission = botPermission;
    }

    addListener(event, func, customId = null) {
        const args = [func];
        if (customId) args.push(customId);
        client.events.set(event, args);
    }

    /**
     *
     * @param {Client} client
     */
    build(client) {
        client.commands.set(this.command.name, {
            execute: this.execute,
            botPermission: this.botPermission,
        });
        return this.command;
    }
}

module.exports = BaseCommand;
