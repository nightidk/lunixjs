const { CanvasRenderingContext2D } = require("canvas");

const DEFAULT_COLORS = {
    default: "#563838",
}

const OBJECTS = {
    image_glass: "./assets/profile_glass.png",
    nickname_glass: "./assets/nicknames_glass.png",
    profile_image: "./assets/profile_image.png"
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {String} font
 * @param {String} nickname 
 * @param {Number} width 
 */
const resizeNickname = (ctx, font, nickname, width) => {
    ctx.font = font;
    let oldTextWidth = ctx.measureText(nickname).width;
    let textWidth = ctx.measureText(nickname).width;
    while (textWidth > width) {
        ctx.font = `${ctx.font.split("px")[0] - 1}px${ctx.font.split("px")[1]}`;
        textWidth = ctx.measureText(nickname).width
    }

    return { font: ctx.font, y: Math.round((oldTextWidth - textWidth) / 100) };
}

module.exports = { DEFAULT_COLORS, OBJECTS, resizeNickname };