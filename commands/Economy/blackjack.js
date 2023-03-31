const { COMMANDS_OPTIONS } = require("../../structure/ENUMS");

const commands = {
    name: "blackjack",
    description: "Play a blackjack game",
    options: [
        {
            name: "amount",
            description: "The amount of the bet",
            type: COMMANDS_OPTIONS.INTEGER_OPTION,
            required: true
        }
    ],
    async execute(interaction) {
        
    }
}