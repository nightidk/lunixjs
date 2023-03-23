const { model, Schema } = require("mongoose");

module.exports = model("guild", new Schema({
    guildID: { type: String, required: true },
    name: { type: String, required: true },
    ownerId: { type: String, required: true },
    balance: { type: Number, required: true },
    createDate: { type: Date, default: Date.now, required: true },
    members: [
        {
            userId: { type: String, required: true },
            deposits: { type: Number, required: true, default: 0 },
            joinDate: { type: Date, required: true, default: Date.now },
        }
    ]
}))