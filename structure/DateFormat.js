/**
 * 
 * @param {Date} d 
 * @returns {String}
 */
const marryFormat = (d) => {
    return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." +
        d.getFullYear().toString().slice(2);
}

/**
 * 
 * @param {Number} seconds 
 * @returns {String}
 */
const dateFormat = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    seconds -= hours * 3600;
    const minutes = Math.floor((seconds % 3600) / 60);
    seconds -= minutes * 60;
    
    return `${hours ? `${hours}ч. ` : ""}${minutes}м.`;
}

/**
 * 
 * @param {Date} date 
 * @returns {String}
 */
const getDays = (date) => {
    return `${Math.floor(Math.round((new Date() - new Date(date).getTime()) / 1000 / 60 / 60 / 24))}дн.`;
}

module.exports = { marryFormat, dateFormat, getDays };