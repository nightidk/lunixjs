const { Guild } = require("discord.js");

/**
 * 
 * @param {Guild} guild 
 * @param {String} name
 */
const getChannelByName = async (guild, name) => {
    const channels = await guild.channels.fetch();
    return channels.find((c) => c.name == name);
}

module.exports = {getChannelByName};