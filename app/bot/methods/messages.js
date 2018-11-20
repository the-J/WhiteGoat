/**
 * Created by juliusz.jakubowski@gmail.com on 18.11.18.
 */

const bot = require('../bot.js');
const twitch = require('../../twitch/init.js');
const db = require('../../db/methods.js');
const BOT = require('../../credentials/botCredentials.js');

const prefix = BOT.PREFIX;
const owner = BOT.OWNER;

const ownerMethods = author => {
    console.log(author);
    // twitchInit.stopListener;
    return false;
};

const handleMessageAndSendResponse = async function ( message ) {
    if (!message) return console.log('empty message was passed: ', message);

    if (message.content.startsWith(prefix) && message.content.length > 1 &&
        (!message.author.bot || message.author.bot === false)) {

        let response = {
            chanelId: message.channel.id,
            author: message.author
        };

        const params = message.content.split(' ');

        const key = params[ 0 ].substring(1).toLowerCase();

        console.log({ params });
        console.log({ key });

        switch (key) {
            case 'twitchadd':
                if (!params[ 1 ] || !params[ 1 ].length) {
                    response.content = 'At least give me users name....';
                    return sendMessage(response);
                }
                else {
                    let checkIfUserExists = false;
                    await twitch.checkIfUserExists(params[ 1 ])
                        .then(
                            result => {
                                if (!result.data.length) {
                                    response.content = 'No such user mate!';
                                }
                                else {
                                    response.content = 'K, I will add this dude to database';
                                }

                                sendMessage(response);
                            },
                            err => {
                                console.log('ererer', { err });
                                response.content = 'Oy! GOt some error: ' + err.message;
                                sendMessage(response);
                            });
                }
                break;
            case 'twitchmessageme':
                console.log('send Twitch message');
                response.content = 'Setting new chanel';
                break;
            case 'stoplistener':
                if (ownerMethods(message.author)) {

                }
                else response.content = 'I don]\'t think so';
                break;
            case 'man':
                response.content = '';
                break;
            default:
                response.content = 'Sure, on it.';
                response.author = '';
        }
    }
};

const sendMessage = function ( message ) {
    bot.bot.channels
        .get(message.chanelId)
        .send(message.content + ' ' + message.author);
};

module.exports.handleMessageAndSendResponse = handleMessageAndSendResponse;
