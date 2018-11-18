/**
 * Created by juliusz.jakubowski@gmail.com on 18.11.18.
 */

const bot = require('../bot.js');
const BOT = require('../botCredentials.js');
const prefix = BOT.PREFIX;

const userCreate = require('../../../db/methods.js');
const twitchChanelCreate = require('../../../db/methods.js');

const handleMessage = function ( message ) {
    if (!message) return console.log('empty message was passed: ', message);

    if (message.author.bot === false && message.content.startsWith(prefix)) {
        const channelId = message.channel.id;
        const content = message.content
            .trim()
            .slice(1, message.content.length)
            .split(' ');

        switch (content[ 0 ].toLowerCase()) {
            case 'twitchadd':
                console.log('adding Twitch')
                twitchChanelCreate('test chanel');
                break;
            default:
                return sendMessage('Pardon - I don\'t know french', channelId, message.author);
        }
    }
};

const sendMessage = function ( message, chanelId , author = '') {
    bot.bot.channels.get(chanelId).send(message + author);
};

const sendMessageDM = function ( message, chanelId , author = '') {
    bot.bot.channels.get(chanelId).send(message + author);
};

exports.handleMessage = handleMessage;
exports.sendMessage = sendMessage;
exports.sendMessageDM = sendMessage;
