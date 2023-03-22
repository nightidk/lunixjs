const { Client, ChannelType, EmbedBuilder } = require("discord.js");
const lunix = require("../schemas/lunix");
const { getChannelByName } = require("./Channels");
const { getUser, getStory, updateStory } = require("./Database");


class Story {
    /**
     * 
     * @param {Client} client 
     * @param {String} userId 
     */
    constructor(client, userId) {
        this.client = client
        this.userId = userId;
        this.initialized = false;
    }

    async init() {
        this.user = await getUser(this.userId);
        this.story = await getStory(this.userId);
        this.lunix = await lunix.findOne();
        this.storyGuild = this.client.guilds.cache.get(this.lunix.STORY_SERVER);
        if (!this.storyGuild) throw new Error("Story Guild is undefined, please provide it in Database");
        this.storyChannel = await getChannelByName(this.storyGuild, this.story.chapter);
        if (!this.storyChannel) throw new Error(`Chapter isn't found, please check it: ${this.story.chapter}`);
        if (this.storyChannel.type !== ChannelType.GuildText) throw new Error(`Chapter channel is ${this.storyChannel.type}, not ${ChannelType.GuildText}`);
        this.chapterDialogs = await this.storyChannel.messages.fetch();
        if (!this.chapterDialogs) throw new Error(`Something go wrong when loading chapter dialogs. Chapter: ${this.story.chapter}`);
        this.initialized = true;
    }

    async getDialog() {
        if (!this.initialized) throw new Error(`Story class isn't initializated. Please, use <Story>.init()`);
        
        try {
            const dialog = this.chapterDialogs.at(this.story.storyPage);
            const jsonDialog = JSON.parse(dialog.content);
            const embed = new EmbedBuilder(jsonDialog);
            //await this.nextDialog();
            return embed;
        } catch (err) {
            Log.error(err);
            throw err;
        }

    }

    async nextDialog() {
        if (!this.initialized) throw new Error(`Story class isn't initializated. Please, use <Story>.init()`);
        
        await updateStory(this.userId);
    }
}

module.exports = Story;