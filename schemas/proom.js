const { model, Schema } = require("mongoose");

module.exports = model("proom", new Schema({
    roomId: { type: String, required: true },
    ownerId: { type: String, required: true }
}))