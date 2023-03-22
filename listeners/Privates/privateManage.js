const { Events, VoiceState, ChannelType } = require("discord.js");

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
                type: ChannelType.GuildVoice
            })

            await newState.member.edit({ channel: channel });
        }
        if (!newState.channel && oldState.channel.parentId === "975406530683867199" && oldState.channel.members.size === 0) {
            await oldState.channel.delete();
        }
    }
}