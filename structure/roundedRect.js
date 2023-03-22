/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} w 
 * @param {Number} h 
 * @param {Number | Array<Number>} r 
 * @returns 
 */
module.exports = (ctx, x, y, w, h, r) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    if (typeof r === "number") {
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
    } else {
        if (r.length < 4)
            throw new Error("Not enoght parameters in radiuses")
        ctx.arcTo(x + w, y, x + w, y + h, r[0]);
        ctx.arcTo(x + w, y + h, x, y + h, r[1]);
        ctx.arcTo(x, y + h, x, y, r[2]);
        ctx.arcTo(x, y, x + w, y, r[3]);
    }
    ctx.closePath();
    return ctx;
}