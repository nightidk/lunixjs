const { model, Schema } = require("mongoose");

module.exports = model("story", new Schema({
    userId: { type: String, required: true },
    chapter: { default: "main", type: String, required: true },
    storyPage: { default: 0, type: Number, required: true }
}))