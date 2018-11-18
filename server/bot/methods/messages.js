/**
 * Created by juliusz.jakubowski@gmail.com on 18.11.18.
 */

const bot = require('../bot.js');
const BOT = require('../../botCredentials.js');
const prefix = BOT.PREFIX;

const userCreate = require('../../../db/methods.js');

const handleMessage = function ( message ) {
    if (!message) return console.log('empty message was passed: ', message);

    if (message.author.bot === false && message.content.startsWith(prefix)) {
        console.log('message passed');
        console.log({ message });

        const channelId = message.channel.id;
        const content = message.content
            .slice(1, message.content.length)
            .split(' ');

        switch (content[ 0 ]) {
            case '':
                break;
            default:
                return sendMessage('Pardon - I don\'t know french', channelId);
        }
    }
};

const sendMessage = function ( message, chanelId ) {
    bot.bot.channels.get(chanelId).send(message);
};

exports.handleMessage = handleMessage;
exports.sendMessage = sendMessage;
