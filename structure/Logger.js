const { TextChannel } = require("discord.js");
const Embed = require("./Embed");
const lunix = require("../schemas/lunix");

class Logger {
    constructor(client) {
        if (client) this.client = client;
        this.logs = [];
    }

    getLogs() {
        return this.logs;
    }

    addLog(message) {
        this.logs.push(message);
        if (this.logs.length > 50) this.logs = this.logs.slice(1);
    }

    init(client) {
        return new Promise(async (resolve, reject) => {
            this.lunixDB = await lunix.findOne({});
            this.client = client;
            try {
                this.client.channels
                    .fetch(this.lunixDB.LOG)
                    .then((channel) => {
                        this.channel = channel;
                        resolve();
                    })
                    .catch((e) => {
                        console.error(e);
                        resolve(e);
                    });
            } catch (e) {
                console.error(e);
                resolve(e);
            }
        });
    }

    send(message) {
        console.log(message);
        if (this.channel) {
            // let key = `[]`;
            // if (message.match(/(\[)([a-z].*)(\])/gi))
            //     key = message.match(/(\[)([a-z].*)(\])/gi)[0];
            message = message.replace(this.client.env.TOKEN, "token :)");

            this.channel
                .send({
                    embeds: [
                        Embed().setDescription(`${message}`)
                    ],
                })
                .catch(console.error);
        }
        this.addLog(message);
    }

    error(message) {
        console.error(message);
        if (this.channel)
            this.channel.send({ content: `@everyone`, embeds: [Embed().setDescription(`${message}`)] }).catch(console.error);
        // this.addLog(`[ERROR] ${message}`);
    }
}

module.exports = Logger;
