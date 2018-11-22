/**
 * Created by juliusz.jakubowski@gmail.com on 18.11.18.
 */
const Discord = require('discord.js');

const messages = require('./methods/messages.js');
const twitchListener = require('./methods/twitchListener.js');

const BOT = require('../credentials/botCredentials.js');
const prefix = BOT.PREFIX;

const bot = new Discord.Client({
    commandPrefix: prefix,
    owner: [ BOT.OWNER ]
});

bot.login(BOT.TOKEN);

bot.on('ready', async () => {
    console.log('Meeeee!!!');
    await twitchListener.startTwitchListener();
});

bot.on('message', message => messages.handleMessageAndSendResponse(message));

module.exports.bot = bot;
