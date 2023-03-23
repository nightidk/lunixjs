const { default: mongoose } = require("mongoose");
const user = require("../schemas/user");
const story = require("../schemas/story");
const proom = require("../schemas/proom");

const connectToDatabase = async (client) => {
    Log.send("[DATABASE] Connecting to Lunix database...");
    await mongoose.connect(client.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch((err) => {
        Log.error(`[DATABASE] Error while connecting to Lunix database: ${err}`);
        process.exit(-1);
    })
    Log.send("[DATABASE] Connected to Lunix database.")
}

const disconnectFromDatabase = async () => {
    Log.send("[DATABASE] Disconnecting from Lunix database...")
    await mongoose.disconnect();
    Log.send("[DATABASE] Disconnected from Lunix database.")
}

const getUser = async (userId) => {
    if ((await user.count({ userId: userId })) == 0)
        await user.create({ userId: userId });
    const userDB = await user.findOne({ userId: userId });
    return userDB;
}

const getStory = async (userId) => {
    if ((await story.count({ userId: userId })) == 0)
        await story.create({ userId: userId });
    const storyDB = await story.findOne({ userId: userId });
    return storyDB;
}

const updateStory = async (userId) => {
    await story.updateOne({ userId: userId }, { $inc: { storyPage: 1 } });
}

const updateChapter = async (userId, chapter) => {
    await story.updateOne({ userId: userId }, { $set: { chapter: chapter } });
}

const getRoom = async (roomId) => {
    const room = await proom.findOne({ roomId: roomId });
    return room;
}

const createRoom = async (roomId, ownerId) => {
    await proom.create({ roomId: roomId, ownerId: ownerId });
}

const deleteRoom = async (roomId) => {
    await proom.deleteOne({ roomId: roomId }).catch(() => {});
}

module.exports = { 
    connectToDatabase, disconnectFromDatabase, getUser, getStory, 
    updateStory, updateChapter, getRoom, createRoom, deleteRoom
};