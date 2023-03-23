const { ChatInputCommandInteraction, AttachmentBuilder, ImageFormat } = require("discord.js");
const { BOT_PERMISSIONS, COMMANDS_OPTIONS } = require("../../structure/ENUMS");
const { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } = require("canvas");
const { DEFAULT_COLORS, OBJECTS, resizeNickname } = require("../../structure/Profile");
const Embed = require("../../structure/Embed");
const roundedRect = require("../../structure/roundedRect");
const roundedAvatar = require("../../structure/roundedAvatar");
const roundedStroke = require("../../structure/roundedStroke");
const { getUser, getStory } = require("../../structure/Database");
const { marryFormat, dateFormat, getDays } = require("../../structure/DateFormat");
const levelXP = require("../../structure/Level");
const { changeColor, hexToRgbA } = require("../../structure/Color");

const command = {
    name: "profile",
    description: "Профиль пользователя",
    botPermission: BOT_PERMISSIONS.DEFAULT,
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
        roundedRect(ctx, 837, 98, 1043, 209, [15, 0, 0, 15]);
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

        // Level lines
        ctx.fillStyle = "#775959";
        roundedRect(ctx, 894, 295, 986, 12, [0, 15, 15, 0])
        ctx.fill();
        let nextLevelXP = levelXP(userDB.level.now + 1);
        ctx.fillStyle = "#563838";
        let levelPercentage = userDB.level.xp !== 0 ? Math.round(100 / (nextLevelXP / userDB.level.xp)) : 0;
        roundedRect(ctx, 894, 295, Math.round(986 / 100 * levelPercentage), 12, [0, 15, 0, 0]);
        ctx.fill();

        // Level number
        ctx.font = "35px 'Proxima Nova Extrabld'";
        ctx.fillStyle = "rgba(255, 255, 255, 0.89)";
        ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
        ctx.shadowBlur = 11;
        ctx.shadowOffsetY = 4;
        ctx.fillText("Уровень", 1691, 160);
        ctx.font = "78px 'Proxima Nova Extrabld'";
        let levelNumber = userDB.level.now.toString();
        let widthLevel = levelNumber.length == 3 ? 1825 : levelNumber.length == 2 ? 1802 : 1779;
        let levelMeasure = ctx.measureText(levelNumber);
        ctx.fillText(levelNumber, widthLevel - levelMeasure.width, 253);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "rgba(0, 0, 0, 0)";

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

        // Load icons and add stats to profile
        const chatImage = await loadImage("./assets/icons/chat.png");
        const voiceImage = await loadImage("./assets/icons/voice.png");
        const topImage = await loadImage("./assets/icons/top.png");
        ctx.drawImage(chatImage, 903, 690);
        ctx.drawImage(voiceImage, 903, 729);
        ctx.drawImage(topImage, 901.5, 775);
        ctx.font = "35px 'Proxima Nova Bold'";
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillText("Чат", 942, 712);
        ctx.fillText("Войс", 942, 755);
        ctx.fillText("Топ", 942, 798);
        let top = "—";
        let voice = dateFormat(userDB.stats.voiceActive.all);
        const chatMeasure = ctx.measureText(userDB.stats.chatActive.all);
        const voiceMeasure = ctx.measureText(voice);
        const topMeasure = ctx.measureText(top);
        ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
        ctx.shadowBlur = 18;
        ctx.shadowOffsetY = 4;
        ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
        ctx.fillText(userDB.stats.chatActive.all, 1342 - chatMeasure.width, 712); 
        ctx.fillText(voice, 1342 - voiceMeasure.width, 755);
        ctx.fillText(top, 1342 - topMeasure.width, 798);
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor = "rgba(0, 0, 0, 0)";

        // Add to profile marry info
        ctx.font = "35px 'Proxima Nova Extrabld'";
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
        ctx.fillText("Вместе", 1458, 473);
        ctx.fillText("Дата", 1458, 530);

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
            ctx.font = "35px 'Proxima Nova Extrabld'";
            ctx.shadowBlur = 11;
            ctx.shadowOffsetY = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
            let dateMarry = marryFormat(userDB.marry.marryDate);
            let daysMarry = getDays(userDB.marry.marryDate);
            const daysMeasure = ctx.measureText(daysMarry);
            const dateMeasure = ctx.measureText(dateMarry);
            ctx.fillText(daysMarry, 1849 - daysMeasure.width, 472);
            ctx.fillText(dateMarry, 1849 - dateMeasure.width, 531);
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowColor = "rgba(0, 0, 0, 0)";
        } else {
            const noMarryMember = await loadImage("./assets/no_marry.png");
            ctx.drawImage(noMarryMember, 821, 395);
            ctx.font = "43px 'Proxima Nova Extrabld'";
            ctx.fillStyle = "#ffffff";
            ctx.shadowBlur = 18;
            ctx.shadowOffsetY = 4;
            ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
            ctx.fillText("Нет брака", 1043, 502);
            ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
            ctx.font = "35px 'Proxima Nova Extrabld'";
            ctx.shadowBlur = 20;
            ctx.shadowOffsetY = 4;
            ctx.shadowOffsetX = 4;
            ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
            ctx.fillText("—", 1813, 472);
            ctx.fillText("—", 1813, 531);
            ctx.shadowBlur = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowColor = "rgba(0, 0, 0, 0)";
        }

        // Story info in profile
        ctx.shadowBlur = 11;
        ctx.shadowOffsetY = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
        ctx.font = "35px 'Proxima Nova Extrabld'";
        ctx.fillStyle = "rgba(255, 255, 255, 0.89)";
        ctx.fillText("Сюжет", 1410, 755);


        let storyScore = (await getStory(member.id)).points.toString();
        ctx.font = "78px 'Proxima Nova Extrabld'";
        let storyScoreMeasure = ctx.measureText(storyScore);
        ctx.fillText(storyScore, 1750 - storyScoreMeasure.width, 769);
        ctx.font = "35px 'Proxima Nova Extrabld'";
        ctx.fillText("очк.", 1750, 769);

        // Guild info in profile
        ctx.shadowBlur = 11;
        ctx.shadowOffsetY = 4;
        ctx.shadowOffsetX = 0;
        ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
        ctx.font = "35px 'Proxima Nova Extrabld'";
        ctx.fillStyle = "rgba(255, 255, 255, 0.89)";
        ctx.fillText("Гильдия", 1007, 917);

        if (!userDB.guild) {
            const guildImage = await loadImage("./assets/icons/guilds/default.png");
            ctx.shadowBlur = 17;
            ctx.shadowOffsetY = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowColor = "rgba(255, 255, 255, 0.77)";
            ctx.drawImage(guildImage, 912, 885);
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowColor = "rgba(0, 0, 0, 0)";

            ctx.fillStyle = "rgba(255, 255, 255, 0.62)";
            ctx.fillText("Нет информации", 1007, 960);
            ctx.fillStyle = "rgba(255, 255, 255, 0.89)";
            ctx.shadowColor = "rgba(255, 255, 255, 0.25)";
            ctx.shadowBlur = 11;
            ctx.shadowOffsetY = 4;
            ctx.fillText("Уровень", 1651, 900);

            ctx.font = "78px 'Proxima Nova Extrabld'";
            ctx.fillText("X", 1701, 976);
        }

        

        // Send profile
        await message.edit({
            embeds: [],
            files: [new AttachmentBuilder().setFile(canvas.toBuffer()).setName(`profile-${interaction.user.id}.png`)]
        })
    }
}

module.exports = command;