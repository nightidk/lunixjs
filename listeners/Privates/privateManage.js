const { Events, VoiceState, ChannelType } = require("discord.js");
const { createRoom, deleteRoom } = require("../../structure/Database");

module.exports = {
    name: Events.VoiceStateUpdate,
    /**
     * 
     * @param {VoiceState} oldState 
     * @param {VoiceState} newState 
     */
    async execute(oldState, newState) {
        if (newState.channelId === "975406582760374312") {
            const channel = await newState.guild.channels.create({
                name: newState.member.displayName,
                parent: newState.channel.parentId,
                type: ChannelType.GuildVoice,
            })
            try {
                await newState.member.voice.setChannel(channel);
                await createRoom(channel.id, newState.member.id);
            } catch (_) {
                await channel.delete().catch(() => {});
                await deleteRoom(channel.id);
            }
        }
        if (!newState.channel && oldState.channel.parentId === "975406530683867199" && oldState.channel.members.size === 0) {
            await deleteRoom(oldState.channel?.id);
            await oldState.channel.delete();
        }
    }
}