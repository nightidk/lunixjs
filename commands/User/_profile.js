const { ChatInputCommandInteraction, AttachmentBuilder, ImageFormat } = require("discord.js");
const { BOT_PERMISSIONS, COMMANDS_OPTIONS } = require("../../structure/ENUMS");
const { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } = require("canvas");
const { DEFAULT_COLORS, OBJECTS } = require("../../structure/Profile");
const Embed = require("../../structure/Embed");
const roundedRect = require("../../structure/roundedRect");
const roundedAvatar = require("../../structure/roundedAvatar");
const roundedStroke = require("../../structure/roundedStroke");
const { getUser } = require("../../structure/Database");
const { marryFormat, dateFormat } = require("../../structure/DateFormat");
const levelXP = require("../../structure/Level");

(function () {
    const RUSSIAN_ALPHABET = /[а-яА-ЯЁё0-9]/;
    var _fillText,
        __slice = [].slice,
        __oldFont;

    _fillText = CanvasRenderingContext2D.prototype.fillText;

    CanvasRenderingContext2D.prototype.fillText = function () {
        var args, offset, previousLetter, str, x, y,
            _this = this;

        str = String(arguments[0]), x = arguments[1], y = arguments[2], args = 4 <= arguments.length ? __slice.call(arguments, 3) : [];

        offset = 0;
        previousLetter = false;
        return [...str].forEach(function (letter) {
            if (RUSSIAN_ALPHABET.test(letter)) {
                __oldFont = _this.font;
                _this.font = `${Number(_this.font.split("px")[0]) - 3}px${_this.font.split("px")[1]}`
            };
            _fillText.apply(_this, [letter, x + offset, y].concat(args));
            _this.font = __oldFont;
            offset += _this.measureText(letter).width;
            return previousLetter = letter;
        });
    };
})();

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

        ctx.fillStyle = DEFAULT_COLORS.main;
        ctx.fillRect(0, 0, 1920, 1080);

        ctx.fillStyle = DEFAULT_COLORS.bottom_part;
        ctx.fillRect(825, 680, 1096, 400);

        const profile_image = await loadImage(OBJECTS.profile_image);
        ctx.drawImage(profile_image, 0, 0);

        const profile_glass = await loadImage(OBJECTS.image_glass);
        ctx.drawImage(profile_glass, 0, 0);

        ctx.fillStyle = DEFAULT_COLORS.middle_rect;
        ctx.fillRect(797, 0, 28, 1080);

        let nickname_gradient = ctx.createLinearGradient(1119, 210, 2500, 210);
        nickname_gradient.addColorStop(0, DEFAULT_COLORS.nickname_rect.first);
        nickname_gradient.addColorStop(1, DEFAULT_COLORS.nickname_rect.second);
        ctx.fillStyle = nickname_gradient;
        ctx.strokeStyle = DEFAULT_COLORS.nickname_stroke;
        ctx.lineWidth = 4;
        roundedRect(ctx, 909, 147, 821, 126, 15);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = DEFAULT_COLORS.level_rect_under;
        roundedRect(ctx, 837, 297, 893, 65, 6);
        ctx.fill();

        ctx.fillStyle = DEFAULT_COLORS.level_rect;
        roundedRect(ctx, 837, 297, 779, 65, 0);
        ctx.fill();

        ctx.fillStyle = nickname_gradient;
        ctx.strokeStyle = DEFAULT_COLORS.nickname_stroke;
        ctx.lineWidth = 4;
        roundedRect(ctx, 909, 445, 821, 126, [15, 0, 15, 15]);
        ctx.fill();
        ctx.stroke();

        let marry_line_gradient = ctx.createLinearGradient(1119, 604, 2500, 604);
        marry_line_gradient.addColorStop(0, DEFAULT_COLORS.marry_line.first);
        marry_line_gradient.addColorStop(1, DEFAULT_COLORS.marry_line.second);
        ctx.fillStyle = marry_line_gradient;
        ctx.strokeStyle = DEFAULT_COLORS.marry_line_stroke;
        ctx.lineWidth = 4;
        roundedRect(ctx, 915, 575, 815, 58, [0, 15, 15, 15]);
        ctx.fill();
        ctx.stroke();


        // Avatars
        const avatar = await roundedAvatar(member.displayAvatarURL({
            extension: ImageFormat.PNG,
            size: 512,
        }), 358, 358)
        ctx.drawImage(avatar, 618, 63)
        const avatarStroke = roundedStroke(358, 358, "#775959", 8, { shadowOffsetX: 18, shadowOffsetY: 4, shadowBlur: 28, shadowColor: "rgba(0, 0, 0, 0.25)" });
        ctx.drawImage(avatarStroke, 618, 63);

        // Marry
        if (userDB.marry.married) {
            try {
                const marryMember = await interaction.guild.members.fetch(userDB.marry.partner)
                const avatarMarry = await roundedAvatar(marryMember.displayAvatarURL({
                    extension: ImageFormat.PNG,
                    size: 512
                }), 186, 186);
                ctx.drawImage(avatarMarry, 849, 447);
                ctx.font = "55px 'Proxima Nova Extrabld'";
                ctx.fillStyle = DEFAULT_COLORS.nickname_color;
                ctx.fillText(marryMember.displayName, 1064, 524);
            } catch (_) {
                const noMarryInfoMember = await loadImage("./assets/no_marry_info.png");
                ctx.drawImage(noMarryInfoMember, 849, 447);
                ctx.font = "55px 'Proxima Nova Extrabld'";
                ctx.fillStyle = DEFAULT_COLORS.nickname_color;
                ctx.fillText("Нет информации", 1064, 524);
            }
            ctx.fillStyle = DEFAULT_COLORS.marry_text;
            ctx.font = "35px 'Proxima Nova Bold'";
            ctx.fillText(marryFormat(userDB.marry.marryDate), 1527, 616);
        } else {
            const noMarryMember = await loadImage("./assets/no_marry.png");
            ctx.drawImage(noMarryMember, 849, 447);
            ctx.font = "55px 'Proxima Nova Extrabld'";
            ctx.fillStyle = DEFAULT_COLORS.nickname_color;
            ctx.fillText("В поиске", 1064, 524);
            ctx.fillStyle = DEFAULT_COLORS.marry_text;
            ctx.font = "35px 'Proxima Nova Bold'";
            ctx.fillText("нет", 1590, 613);
        }

        const marryStroke = roundedStroke(198, 198, "#775959", 8, { shadowOffsetX: 18, shadowOffsetY: 4, shadowBlur: 28, shadowColor: "rgba(0, 0, 0, 0.25)" });
        ctx.drawImage(marryStroke, 843, 441);

        const marryIcon = await loadImage("./assets/marry_icon.png");
        ctx.drawImage(marryIcon, 1681, 585);

        ctx.font = "43px 'Proxima Nova Bold'";
        ctx.fillStyle = DEFAULT_COLORS.marry_text;
        ctx.fillText("Брачные узы", 1047, 617);

        // Glasses
        const nickname_glass = await loadImage(OBJECTS.nickname_glass);
        ctx.drawImage(nickname_glass, 1374, 148);
        ctx.drawImage(nickname_glass, 1374, 446);


        // Bottom info
        ctx.fillStyle = DEFAULT_COLORS.icons_rect;
        ctx.strokeStyle = DEFAULT_COLORS.icons_rect_stroke;
        roundedRect(ctx, 875, 721, 460, 50, 3);
        ctx.fill();
        ctx.stroke();
        roundedRect(ctx, 1379, 721, 460, 50, 3);
        ctx.fill();
        ctx.stroke();
        roundedRect(ctx, 875, 794, 964, 50, 3);
        ctx.fill();
        ctx.stroke();
        roundedRect(ctx, 875, 874, 964, 153, 3);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = DEFAULT_COLORS.icon_color;
        ctx.strokeStyle = DEFAULT_COLORS.icon_stroke;
        ctx.lineWidth = 3;
        let x = 956;
        for (let i = 0; i < 8; i++) {
            roundedRect(ctx, x, 898, 67, 105, 10)
            ctx.fill();
            ctx.stroke();
            x += 105;
        }

        // Draw text

        ctx.font = "55px 'Proxima Nova Bold'";
        ctx.fillStyle = DEFAULT_COLORS.level_color;
        let levelMeasure = ctx.measureText(userDB.level.now);
        ctx.fillText(userDB.level.now, 1723 - levelMeasure.width, 348);

        ctx.font = "55px 'Proxima Nova Extrabld'";
        ctx.fillStyle = DEFAULT_COLORS.nickname_color;
        ctx.fillText(member.displayName, 1005, 227);

        ctx.font = "45px 'Proxima Nova Bold'";
        ctx.fillStyle = DEFAULT_COLORS.level_string_color;
        ctx.fillText("уровень профиля", 1005, 342);

        ctx.font = "35px 'Proxima Nova Extrabld'";
        ctx.fillStyle = DEFAULT_COLORS.stats;
        ctx.fillText("чат", 891, 756);
        const chatMeasure = ctx.measureText(userDB.stats.chatActive.all);
        ctx.fillText(userDB.stats.chatActive.all, 1315 - chatMeasure.width, 756);
        ctx.fillText("войс", 1388, 756);
        const voice = dateFormat(userDB.stats.voiceActive.all);
        const voiceMeasure2 = ctx.measureText(voice);
        ctx.fillText(voice, 1816 - voiceMeasure2.width, 756);
        ctx.fillText("опыта до следующего уровня", 891, 829);
        const XP = `${userDB.level.xp}/${levelXP(userDB.level.now + 1)}`;
        const XPMeasure = ctx.measureText(XP);
        ctx.fillText(XP, 1816 - XPMeasure.width, 829);

        // Send profile
        await message.edit({
            embeds: [
                Embed()
                    .setImage(`attachment://profile-${interaction.user.id}.png`)
                    .setFooter({ text: interaction.member.displayName, iconURL: interaction.member.displayAvatarURL({ dynamic: true }) })
            ],
            files: [new AttachmentBuilder().setFile(canvas.toBuffer()).setName(`profile-${interaction.user.id}.png`)]
        })
    },
};

module.exports = command;
