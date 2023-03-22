const { model, Schema } = require("mongoose");

module.exports = model("lunix", new Schema({
    BETA_USERS: { type: [{ type: String }], required: true },
    DEVELOPERS: { type: [{ type: String }], required: true },
    DEBUG: { type: Boolean, required: true },
    LOG: { type: String, required: true },
    STORY_SERVER: { type: String, required: true },
}), "lunix")