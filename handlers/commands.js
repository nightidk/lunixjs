const fs = require("fs");
const BaseCommand = require("../structure/BaseCommand");
const { loadFiles } = require("../functions/fileLoader");
const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
    Log.send(`[HANDLER/COMMANDS] Хендлер Slash-комманд запущен.`);
    const slashes = [];
    const Files = await loadFiles("commands");
    Files.forEach((file) => {
        const cmd = require(file);
        const cmdInit = new BaseCommand(cmd.name, cmd.description, cmd.execute, cmd.botPermission, cmd.permissions, cmd.options);
        slashes.push(cmdInit.build(client));
        delete require.cache[require.resolve(file)];
    });
    await client.application.commands
        .set(slashes).catch((err) => {
            Log.send(
                `[HANDLER/COMMANDS] Ошибка установки slash-комманд: ${err}`
            );
            process.exit(-1);
        });
    Log.send(
        `[HANDLER/COMMANDS] Установлено ${slashes.length} slash-комманд.`
    );


};
