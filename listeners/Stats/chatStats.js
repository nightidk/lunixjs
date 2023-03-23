const { Events, Message } = require("discord.js");
const { updateChatStats } = require("../../structure/Database");

module.exports = {
    name: Events.MessageCreate,
    /**
     * 
     * @param {Message} message 
     */
    async execute(message) {
        if (message.author.bot) return;
        await updateChatStats(message.author.id, message.channel.id);
    }
}