const { createCanvas, Image } = require("canvas");

/**
*
* @param {Number} w
* @param {Number} h
* @param {String} h
* @param {String} strokeStyle
* @param {Number} lineWidth
* @param {{shadowOffsetX: Number, shadowOffsetY: Number, shadowBlur: Number, shadowColor: String}} shadow
* @returns {Image}
*/
module.exports = (w, h, strokeStyle, lineWidth, shadow = null) => {
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");

    ctx.beginPath();

    ctx.arc(
        w / 2,
        h / 2,
        w / 2 - lineWidth / 2,
        0,
        Math.PI * 2
    );

    ctx.closePath();
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    if (shadow) {
        ctx.shadowOffsetX = shadow.shadowOffsetX;
        ctx.shadowOffsetY = shadow.shadowOffsetY;
        ctx.shadowBlur = shadow.shadowBlur;
        ctx.shadowColor = shadow.shadowColor;
    }
    ctx.stroke();

    const newImage = new Image();
    newImage.src = canvas.toBuffer();
    return newImage;
}