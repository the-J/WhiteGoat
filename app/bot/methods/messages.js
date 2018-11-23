/**
 * Created by juliusz.jakubowski@gmail.com on 22.11.18.
 */

const bot = require('../bot.js');
const db = require('../../db/methods.js');
const MTwitch = require('./messagesTwitch.js');
const BOT = require('../../credentials/botCredentials.js');
const prefix = BOT.PREFIX;


const handleMessageAndSendResponse = async function ( message ) {
    if (!message) return console.log('empty message was passed: ', message);

    if (message.system) {
        let mentions = '';

        if (message.dbData.userIds.length) {
            mentions = message.dbData.userIds.map(userId => '<@' + userId + '> ').join();
        }

        message.embed = {
            title: 'https://www.twitch.tv/' + message.dbData.chanelName,
            url: 'https://www.twitch.tv/' + message.dbData.chanelName,
            color: 6570404,
            image: {
                url: 'https://static-cdn.jtvnw.net/previews-ttv/live_user_' + message.dbData.chanelName + '-1280x720.jpg'
            },
            author: {
                name: message.dbData.chanelName + ' ' + message.dbData.message
            },
            fields: [
                {
                    name: 'Started at ',
                    value: message.streamData.started_at,
                    inline: true
                }
            ]
        };

        delete message.dbData;
        delete message.streamData;

        sendMessage(message);

        if (mentions) {
            delete message.embed;
            message.content = mentions;
            message.author = '';
            sendMessage(message);
        }

        return;
    }


    if (message.content.startsWith(prefix) && message.content.length > 1 &&
        (!message.author.bot || message.author.bot === false)) {

        const response = {
            chanelId: message.channel.id,
            author: message.author,
            embed: false
        };

        // const params = message.content.split(' ');
        const key = message.content.split(' ')[ 0 ].charAt(1);

        switch (key) {
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

module.exports.handleMessageAndSendResponse = handleMessageAndSendResponse;
module.exports.sendMessage = sendMessage;
