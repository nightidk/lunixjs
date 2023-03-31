require("dotenv").config();
const { Client, IntentsBitField, Collection } = require("discord.js");
const startLoops = require("./loops/startLoops");
const Logger = require("./structure/Logger");

const { Guilds, GuildMembers, GuildVoiceStates, GuildMessages, GuildModeration, MessageContent } =
    IntentsBitField.Flags;

global.Log = new Logger();

const client = new Client({
    intents: [Guilds, GuildMembers, GuildVoiceStates, GuildMessages, GuildModeration, MessageContent],
});

client.env = process.env;

client.login(client.env.TOKEN).then(async () => {
    await require("./structure/Database").connectToDatabase(client);
    await Log.init(client);
    Log.send("[INDEX] Инициализация бота...");
    client.commands = new Collection();
    client.loops = new Collection();
    client.oldVoiceMembers = new Array();
    await require("./handlers/commands")(client);
    await require("./handlers/events")(client);
    Log.send(`[INDEX] Бот авторизован под ${client.user.tag}`);
    require("./structure/Console")(client);
    startLoops(client);
});

client.on('error', Log.error)
client.on('warn', Log.error)
process.on('uncaughtException', Log.error);
process.on('unhandledRejection', Log.error);