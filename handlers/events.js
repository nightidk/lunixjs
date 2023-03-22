const { Client } = require("discord.js");

/**
 *
 * @param {Client} client
 */
async function loadEvents(client) {
    Log.send(`[HANDLER/EVENTS] Хендлер ивентов запущен.`);
    const { loadFiles } = require("../functions/fileLoader");

    const Files = await loadFiles("listeners");

    let events = 0;

    Files.forEach((file) => {
        const event = require(file);

        const execute = (...args) => event.execute(...args, client);

        const target = event.rest ? client.rest : client;
        target[event.once ? "once" : "on"](event.name, execute);

        events += 1;
    });

    Log.send(`[HANDLER/EVENTS] Загружено ${events} ивентов.`);
}

module.exports = loadEvents;
