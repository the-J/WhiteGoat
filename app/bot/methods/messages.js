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

const manual =
    'Off we go\n' +
    '```diff\n' +
    '+ NOTE\n' +
    ' - commands are not case sensitive;\n' +
    ' - when command param is in [] - it is required, else it is not.\n\n\n' +
    '+ COMMANDS\n' +
    ' * tChannels - list of twitch saved channels;\n' + // done
    ' * tAdd [chanel name] (message) - twitch stream listener;\n' + // done
    ' * tAddMe [chanel name] - will notify you when selected twitch chanel goes live;\n' + // in progress
    ' * tRemoveMe [chanel name] - ~tAddMe;\n' +
    ' * tMine [chanel name] - channels that will notify you;\n' +
    '+ ADMIN COMMANDS\n' +
    ' * tRemove [chanel name] - remove twitch stream listener;\n' +
    '```';

const handleMessageAndSendResponse = async function ( message ) {
    if (!message) return console.log('empty message was passed: ', message);

    if (message.content.startsWith(prefix) && message.content.length > 1 &&
        (!message.author.bot || message.author.bot === false)) {

        let response = {
            chanelId: message.channel.id,
            author: message.author,
            embed: false
        };

        const params = message.content.split(' ');

        const key = params[ 0 ].substring(1).toLowerCase();

        console.log({ params });
        console.log({ key });

        switch (key) {
            case 'tadd':
                if (!params[ 1 ] || !params[ 1 ].length) {
                    response.content = 'Twitch chanel name required mate!';
                    return sendMessage(response);
                }
                else {
                    let userExist = false;

                    await twitch.checkIfUserExists(params[ 1 ])
                        .then(
                            result => {
                                if (!result.data.length) {
                                    response.content = 'No such user on twitch ' + params[ 1 ] + ' mate! Try again.';
                                    sendMessage(response);
                                }
                                else userExist = true;
                            },
                            err => {
                                response.content = 'Oy! Got some error: ' + err.message;
                                sendMessage(response);
                            });

                    if (userExist) {
                        const chanelMessage = params.slice(2).join(' ');

                        await db.twitchChanelCreate(params[ 1 ], chanelMessage)
                            .then(
                                result => {
                                    if (result.id) {
                                        response.content = 'Added ' + params[ 1 ] + ' to database. I will keep eye on him';
                                        sendMessage(response);
                                    }
                                    else if (result.exists) {
                                        response.content = 'I already got ' + params[ 1 ] + ' on the list.';
                                        sendMessage(response);
                                    }
                                    else {
                                        response.content = 'Dunno what happened, try again';
                                        sendMessage(response);
                                    }
                                },
                                err => {
                                    response.content = 'Oy! Got some error: ' + err.message;
                                    sendMessage(response);
                                });
                    }
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
                response.content = manual;
                response.author = '';
                return sendMessage(response);
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
