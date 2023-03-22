const { createCanvas, loadImage, Image } = require("canvas");

/**
*
* @param {String} ImageURL
* @param {Number} w
* @param {Number} h
* @returns {Image}
*/
module.exports = async (ImageURL, w, h) => {
    const canvas = createCanvas(w, h);
    const ctx = canvas.getContext("2d");

    ctx.beginPath();

    ctx.arc(
        w / 2,
        h / 2,
        w / 2 - 2,
        0,
        Math.PI * 2
    );

    ctx.closePath();

    ctx.clip();

    let image = await loadImage(ImageURL);

    ctx.drawImage(image, 0, 0, w, h);

    const newImage = new Image();
    newImage.src = canvas.toBuffer();
    return newImage;
}