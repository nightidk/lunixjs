const { Schema, model } = require("mongoose");

module.exports = model(
    "user",
    new Schema({
        userId: { type: String, required: true },
        balance: {
            default: {
                common: 0,
                donate: 0
            },
            type: {
                common: { type: Number, required: true },
                donate: { type: Number, required: true },
            },
            required: true,
        },
        level: {
            default: {
                now: 1,
                xp: 0,
            },
            type: {
                now: { type: Number, required: true },
                xp: { type: Number, required: true },
            },
            required: true
        },
        marry: {
            default: {
                married: false
            },
            type: {
                married: { type: Boolean, required: true },
                partner: { type: String, required: false },
                marryDate: { type: Date, required: false }
            },
            required: true
        },
        stats: {
            default: {
                voiceActive: {
                    all: 0,
                    d7: { channels: [], count: 0 },
                    d14: { channels: [], count: 0 }
                },
                chatActive: {
                    all: 0,
                    d7: { channels: [], count: 0 },
                    d14: { channels: [], count: 0 }
                }
            },
            type: {
                voiceActive: {
                    type: {
                        all: { type: Number, required: true },
                        d7: {
                            type: {
                                channels: [
                                    { channelId: String, count: Number },
                                ],
                                count: { type: Number, required: true },
                            },
                            required: true,
                        },
                        d14: {
                            type: {
                                channels: [
                                    { channelId: String, count: Number },
                                ],
                                count: { type: Number, required: true },
                            },
                            required: true,
                        },
                    },
                    required: true,
                },
                chatActive: {
                    type: {
                        all: { type: Number, required: true },
                        d7: {
                            type: {
                                channels: [
                                    { channelId: String, count: Number },
                                ],
                                count: { type: Number, required: true },
                            },
                            required: true,
                        },
                        d14: {
                            type: {
                                channels: [
                                    { channelId: String, count: Number },
                                ],
                                count: { type: Number, required: true },
                            },
                            required: true,
                        },
                    },
                    required: true,
                },
            },
            required: true,
        },
        customProfile: {
            default: {
                enabled: false,
                color: "#000000"
            },
            type: {
                enabled: { type: Boolean, required: true },
                color: { type: String, required: true },
            },
            required: true
        }
    })
);
