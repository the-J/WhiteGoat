/**
 * Created by juliusz.jakubowski@gmail.com on 18.11.18.
 */
const Discord = require('discord.js');

const db = require('../db/methods');
const messages = require('./methods/messages.js');
const twitch = require('../twitch/init.js');

const BOT = require('../credentials/botCredentials.js');
const prefix = BOT.PREFIX;

const bot = new Discord.Client({
    commandPrefix: prefix,
    owner: [ BOT.OWNER ]
});

bot.login(BOT.TOKEN);

let twitchChannels = [];

bot.on('ready', async () => {
    console.log('Meeeee!!!');

    await db.allTwitchChannels().then(channels => twitchChannels = channels);

    setInterval(streaming, 2000);
});

bot.on('message', message => messages.handleMessageAndSendResponse(message));

async function streaming() {
    if (twitchChannels.length) {
        const channels = twitchChannels.map(chanel => chanel.chanelName + '&user_login=');
        console.log(channels);

        console.log({ twitchChannels }, { channels });

        await twitch.checkIfStreaming(channels)
            .then(streaming => {
                console.log({ streaming });
            });
    }
    else console.log('no one to follow');
}

function updateStreamListener(chanelName) {
    console.log('updateStreamListener');
}

module.exports.bot = bot;
module.exports.updateStreamListener = updateStreamListener;
