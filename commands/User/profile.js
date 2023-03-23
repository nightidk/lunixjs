const { ChatInputCommandInteraction, AttachmentBuilder, ImageFormat } = require("discord.js");
const { BOT_PERMISSIONS, COMMANDS_OPTIONS } = require("../../structure/ENUMS");
const { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } = require("canvas");
const { DEFAULT_COLORS, OBJECTS, resizeNickname } = require("../../structure/Profile");
const Embed = require("../../structure/Embed");
const roundedRect = require("../../structure/roundedRect");
const roundedAvatar = require("../../structure/roundedAvatar");
const roundedStroke = require("../../structure/roundedStroke");
const { getUser } = require("../../structure/Database");
const { marryFormat, dateFormat } = require("../../structure/DateFormat");
const levelXP = require("../../structure/Level");
const { changeColor, hexToRgbA } = require("../../structure/Color");

const command = {
    name: "profile",
    description: "Профиль пользователя",
    botPermission: BOT_PERMISSIONS.BETA,
    options: [
        {
            type: COMMANDS_OPTIONS.USER_OPTION,
            name: "user",
            description: "Пользователь, профиль которого Вы хотите посмотреть",
            required: false,
        },
    ],
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction) {
        await interaction.deferReply();
        const message = await interaction.editReply({
            embeds: [
                Embed()
                    .setDescription("```Производится генерация профиля... Пожалуйста, подождите.```")
                    .setFooter({ text: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            ]
        })

        const member = await interaction.guild.members.fetch({ user: interaction.options.getUser("user")?.id || interaction.user.id })
        const userDB = await getUser(member.id);


        const canvas = createCanvas(1920, 1080);
        const ctx = canvas.getContext("2d");
        registerFont("./fonts/ProximaNova-Bold.ttf", {
            family: "Proxima Nova Bold"
        });
        registerFont("./fonts/ProximaNova-Extrabld.ttf", {
            family: "Proxima Nova Extrabld"
        });

        //! This function will appear in the future. 
        // let color;
        // if (userDB.customProfile.enabled) {
        //     color = userDB.customProfile.color;
        // } else {
        //     color = DEFAULT_COLORS.default;
        // }

        ctx.fillStyle = "#1B0E0E"; //! changeColor(-0.85, color);
        ctx.fillRect(0, 0, 1920, 1080);

        ctx.fillStyle = "rgba(255, 255, 255, 0.05)"; //! changeColor(-0.95, color);
        roundedRect(ctx, 837, 647, 1043, 379, 27);
        ctx.fill();

        const profile_image = await loadImage(OBJECTS.profile_image);
        ctx.drawImage(profile_image, 0, 0);

        const profile_glass = await loadImage(OBJECTS.image_glass);
        ctx.drawImage(profile_glass, 0, 0);

        ctx.fillStyle = "rgba(57, 37, 37, 1)"; //! changeColor(-0.95, color);
        ctx.fillRect(800, 0, 6, 1080);

        let mainGradient = ctx.createLinearGradient(837, 98 + Math.round(209 / 2), 837 + 1043, 98 + Math.round(209 / 2));
        //! linearGradient.addColorStop(0, hexToRgbA("#000000", 0.05));
        //! linearGradient.addColorStop(1, hexToRgbA(changeColor(0.9, color), 0.05));
        mainGradient.addColorStop(0, "rgba(255, 255, 255, 0.05)");
        mainGradient.addColorStop(1, "rgba(228, 161, 161, 0.05)");
        ctx.fillStyle = mainGradient;
        roundedRect(ctx, 837, 98, 1043, 209, 27);
        ctx.fill();

        roundedRect(ctx, 876, 403, 1004, 171, 27);
        ctx.fill();

        let statsGradient = ctx.createLinearGradient(880, Math.round(487 / 2), 1900, Math.round(487 / 2));
        statsGradient.addColorStop(0, "rgba(0, 0, 0, 0.2)");
        statsGradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
        ctx.fillStyle = statsGradient;
        roundedRect(ctx, 876, 668, 487, 153, 27);
        ctx.fill();

        let storyGradient = ctx.createLinearGradient(1390, Math.round(487 / 2), 2400, Math.round(487 / 2));
        storyGradient.addColorStop(0, "rgba(0, 0, 0, 0.2)");
        storyGradient.addColorStop(1, "rgba(255, 255, 255, 0.2)");
        ctx.fillStyle = storyGradient;
        roundedRect(ctx, 1388, 668, 451, 153, 27);
        ctx.fill();
        
        let guildGradient = ctx.createLinearGradient(877, Math.round(851 / 2), 877 + 964, Math.round(851 / 2));
        guildGradient.addColorStop(1, "rgba(0, 0, 0, 0.2)");
        guildGradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
        ctx.fillStyle = guildGradient;
        roundedRect(ctx, 877, 851, 964, 153, 27);
        ctx.fill();

        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        roundedRect(ctx, 1436, 422, 429, 135, 27);
        ctx.fill();

        // Avatars
        const avatar = await roundedAvatar(member.displayAvatarURL({
            extension: ImageFormat.PNG,
            size: 512,
        }), 300, 300)
        ctx.drawImage(avatar, 650, 53)
        const avatarStroke = roundedStroke(308, 308, "#775959", 8, { shadowOffsetX: 18, shadowOffsetY: 4, shadowBlur: 28, shadowColor: "rgba(0, 0, 0, 0.25)" });
        ctx.drawImage(avatarStroke, 646, 49);

        // Nickname
        let resize = resizeNickname(ctx, "62px 'Proxima Nova Extrabld'", member.displayName, 685);
        ctx.font = resize.font;
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 4;
        ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
        ctx.fillText(member.displayName, 980, 222 - resize.y);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "rgba(0, 0, 0, 0)";

        // Marry
        if (userDB.marry.married) {
            try {
                const marryMember = await interaction.guild.members.fetch(userDB.marry.partner)
                const avatarMarry = await roundedAvatar(marryMember.displayAvatarURL({
                    extension: ImageFormat.PNG,
                    size: 512
                }), 180, 180);
                ctx.drawImage(avatarMarry, 825, 399);
                let resize = resizeNickname(ctx, "43px 'Proxima Nova Extrabld'", marryMember.displayName, 385);
                ctx.font = resize.font;
                ctx.fillStyle = "#ffffff";
                ctx.shadowBlur = 18;
                ctx.shadowOffsetY = 4;
                ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
                ctx.fillText(marryMember.displayName, 1035, 502 - resize.y);
                const marryStroke = roundedStroke(188, 188, "#775959", 8, { shadowOffsetX: 18, shadowOffsetY: 4, shadowBlur: 28, shadowColor: "rgba(0, 0, 0, 0.25)" });
                ctx.drawImage(marryStroke, 821, 395);
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "rgba(0, 0, 0, 0)";
            } catch (err) {
                const noMarryInfoMember = await loadImage("./assets/no_marry.png");
                ctx.drawImage(noMarryInfoMember, 821, 395);
                ctx.font = "43px 'Proxima Nova Extrabld'";
                ctx.fillStyle = "#ffffff";
                ctx.shadowBlur = 18;
                ctx.shadowOffsetY = 4;
                ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
                ctx.fillText("Нет информации", 1043, 502); 
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = "rgba(0, 0, 0, 0)";
            }
            // ctx.fillStyle = DEFAULT_COLORS.marry_text;
            // ctx.font = "35px 'Proxima Nova Bold'";
            // ctx.fillText(marryFormat(userDB.marry.marryDate), 1527, 616);
        } else {
            const noMarryMember = await loadImage("./assets/no_marry.png");
            ctx.drawImage(noMarryMember, 821, 395);
            ctx.font = "43px 'Proxima Nova Extrabld'";
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 18;
            ctx.shadowOffsetY = 4;
            ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
            ctx.fillText("Нет брака", 1043, 502);
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowColor = "rgba(0, 0, 0, 0)";
            // ctx.fillStyle = DEFAULT_COLORS.marry_text;
            // ctx.font = "35px 'Proxima Nova Bold'";
            // ctx.fillText("нет", 1590, 613);
        }

        // Send profile
        await message.edit({
            embeds: [],
            files: [new AttachmentBuilder().setFile(canvas.toBuffer()).setName(`profile-${interaction.user.id}.png`)]
        })
    }
}

module.exports = command;