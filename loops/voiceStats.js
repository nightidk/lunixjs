const { Client, ChannelType } = require("discord.js");
const { updateVoiceStats } = require("../structure/Database");
const Timer = require("../structure/Timer")

/**
 * 
 * @param {Client} client 
 */
const loop = async (client) => {
    let voiceChannels = (await (await client.guilds.fetch("974946487047962714")).channels.fetch()).filter((channel) => channel.members?.size != 0 && (channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice));
    let newVoiceMembers = new Array();
    voiceChannels.forEach((channel) => {
        newVoiceMembers.push(...channel.members.map((member) => member));
    });
    client.oldVoiceMembers = newVoiceMembers;
    if (client.oldVoiceMembers.length === 0)
        client.oldVoiceMembers = newVoiceMembers;
    else {
        for (let member of client.oldVoiceMembers) {
            if (newVoiceMembers.some((m) => m.id === member.id)) {
                if (member.voice.channel === newVoiceMembers.find((m) => m.id === member.id).voice.channel)
                    await updateVoiceStats(member.id, member.voice.channel.id);
            }
        }
        client.oldVoiceMembers = newVoiceMembers;
    }
}


/**
 * 
 * @param {Client} client 
 */
const voiceStats = (client) => {
    let timer = Timer(client, "voiceStats", loop, 60000, client);
    client.loops.set("voiceStats", timer);
}

module.exports = voiceStats;

