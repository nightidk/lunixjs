const { ButtonInteraction, Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,
    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @returns 
     */
    async execute(interaction) {
        if (!interaction.isButton()) return;
        if (interaction.customId !== "verify") return;

        if (interaction.member.roles.cache.some((r) => r.id === "1079801829476536340")) return await interaction.reply({ content: "Ты уже зарегестрирован.", ephemeral: true });
        
        await interaction.member.roles.add("1079801829476536340");
        await interaction.reply({ content: "Регистрация прошла успешно. Добро пожаловать!", ephemeral: true });
    }
}