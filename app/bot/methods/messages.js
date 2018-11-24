/**
 * Created by juliusz.jakubowski@gmail.com on 22.11.18.
 */

const bot = require('../bot.js');
const MTwitch = require('./messagesTwitch.js');
const MSys = require('./messagesSystem.js');
const MAdmin = require('./messagesAdmin.js');
const BOT = require('../../credentials/botCredentials.js');
const prefix = BOT.PREFIX;

let botChanelId;
let botAdmins;

const handleMessage = async function ( message ) {
    if (!message) return console.log('empty message was passed: ', message);

    if (message.system) {
        return await MSys.handleSystemMessage(message);
    }

    // if (!botChanelId) {
    //     console.log('no bot channel Id set')
    //     await botChanelId().then(chanelId => botChanelId = chanelId);
    // }


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

module.exports.handleMessage = handleMessage;
module.exports.sendMessage = sendMessage;
