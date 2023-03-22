const readline = require("node:readline/promises");
const { stdin, stdout } = require('node:process');
const { exec } = require("child_process");
const lunix = require("../schemas/lunix");

module.exports = (client) => {
    const rl = readline.createInterface({ input: stdin, output: stdout });
    rl.on('line', async (input) => {
        input = input.split(" ");
        const command = input[0];
        const args = input.slice(1);
        switch (command) {
            case "exit": {
                Log.send("[CONSOLE] Logout with command.");
                await sleep(1000);
                exec("pm2 stop index");
            } break;
            case "reboot": {
                Log.send("[CONSOLE] Reboot with command.");
                await sleep(1000);
                exec("pm2 restart index");
            } break;
            case "logs": {
                const logs = Log.getLogs();
                console.log(logs.join("\n"));
            } break;
            case "addBeta": {
                args.forEach(async (v) => {
                    await lunix.updateOne({}, { $push: { BETA_USERS: v } });
                    Log.send(`[CONSOLE] Added ${v} to BETA_USERS`);
                })
            } break;
            case "reloadCommands": {
                client.commands.clear();
                await require("../handlers/commands")(client);
                Log.send("[CONSOLE] Reloaded commands.");
            } break;
            default: {
                console.log("Unknown command.")
            }
        }
    });
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));