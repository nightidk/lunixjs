
/**
 * 
 * @param {Number} level 
 */
const levelXP = (level) => {
    return parseInt((100 * level * 0.4 / 8 * 225 + (level / 0.8 * 100)).toFixed(0));
}

module.exports = levelXP;