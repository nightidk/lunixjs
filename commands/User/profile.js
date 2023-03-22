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
const { changeColor, hexToRgbA } = require("../../structure/Color");

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

        let color;
        if (userDB.customProfile.enabled) {
            color = userDB.customProfile.color;
        } else {
            color = DEFAULT_COLORS.default;
        }

        ctx.fillStyle = changeColor(-0.85, color);
        ctx.fillRect(0, 0, 1920, 1080);

        ctx.fillStyle = changeColor(-0.95, color);
        roundedRect(ctx, 837, 679, 1043, 379, 27);
        ctx.fill();

        const profile_image = await loadImage(OBJECTS.profile_image);
        ctx.drawImage(profile_image, 0, 0);

        const profile_glass = await loadImage(OBJECTS.image_glass);
        ctx.drawImage(profile_glass, 0, 0);

        ctx.fillStyle = changeColor(-0.95, color);
        ctx.fillRect(800, 0, 6, 1080);

        let linearGradient = ctx.createLinearGradient(837, 98 + Math.round(209 / 2), 837 + 1043, 98 + Math.round(209 / 2));
        linearGradient.addColorStop(0, hexToRgbA("#000000", 0.05));
        linearGradient.addColorStop(1, hexToRgbA(changeColor(0.9, color), 0.05));
        ctx.fillStyle = linearGradient;
        roundedRect(ctx, 837, 98, 1043, 209, 27);
        ctx.fill();

        roundedRect(ctx, 876, 403, 1004, 171, 27);
        ctx.fill();

        // Send profile
        await message.edit({
            embeds: [],
            files: [new AttachmentBuilder().setFile(canvas.toBuffer()).setName(`profile-${interaction.user.id}.png`)]
        })
    }
}

module.exports = command;