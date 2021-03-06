/**
 * Created by juliusz.jakubowski@gmail.com on 18.11.18.
 */
const Discord = require('discord.js');

const dbTwitch = require('../db/methodsTwitch.js');
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

    let message = {};

    bot.user.setActivity("!tman");

    await dbTwitch.createTwitchSettings()
        .then(settings => {
            let chanelId;

            if (settings && !settings.chanelId) {
                bot.guilds.forEach(guild => {
                    guild.channels.forEach(chanel => {
                        chanelId = chanel.id;
                    });
                });

                message = {
                    system: true,
                    type: 'lackOfChannelId',
                    chanelId,
                    author: BOT.OWNER
                };
            }
            else {
                message = {
                    system: true,
                    type: 'welcome',
                    chanelId: settings.chanelId
                };
            }

            messages.handleMessage(message);
        })
        .catch(err => console.log(err));

    if (message) {
        await twitchListener.startTwitchListener();
    }
});

bot.on('message', message => {
    return messages.handleMessage(message);
});

module.exports.bot = bot;
