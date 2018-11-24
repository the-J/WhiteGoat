/**
 * Created by juliusz.jakubowski@gmail.com on 22.11.18.
 */

const bot = require('../bot.js');
const MTwitch = require('./messagesTwitch.js');
const MSys = require('./messagesSystem.js');
const MAdm = require('./messagesAdmin.js');

const dbTwitch = require('../../db/methodsTwitch.js');

const BOT = require('../../credentials/botCredentials.js');
const prefix = BOT.PREFIX;

let botSettings;
let chanelId;

const handleMessage = async function ( message ) {
    if (!message) return console.log('empty message was passed: ', message);

    if (message.system) {
        return await MSys.handleSystemMessage(message);
    }

    const key = message.content.split(' ')[ 0 ].charAt(1);

    if (key === 's' && message.author.id === BOT.OWNER) {
        return MAdm.handleAdminMessages(message);
    }

    if (!botSettings || !botSettings.chanelId || (key === 'u' && message.author.id === BOT.OWNER)) {
        await dbTwitch.botTwitchSettings().then(settings => botSettings = settings);
    }

    if (message.content.startsWith(prefix)
        && message.content.length > 1
        && (!message.author.bot
            || message.author.bot === false)
        && botSettings.chanelId) {

        const response = {
            chanelId: botSettings.chanelId,
            author: message.author,
            embed: false
        };

        // const key = message.content.split(' ')[ 0 ].charAt(1);

        switch (key) {
            case 'u':
                response.content = 'Updated';
                response.author = '';
                return sendMessage(response);
            case 't':
                return await MTwitch.handleTwitchMessage(message, response);
            default:
                response.content = 'I dont get it, could you repeat ' + message.author + ', pls?';
                response.author = '';
                return sendMessage(response);
        }
    }
};


const sendMessage = function ( message ) {
    bot.bot.channels
        .get(message.chanelId)
        .send(
            message.embed
                ? { embed: message.embed }
                : message.content + ' ' + message.author
        );
};

module.exports.handleMessage = handleMessage;
module.exports.sendMessage = sendMessage;
