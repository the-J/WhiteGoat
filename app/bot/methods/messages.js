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
            case 'tchannels':
                await db.allTwitchChannels()
                    .then(channels => {
                        if (!channels.length) {
                            response.content = 'Sry, no channels in my DB.';
                            sendMessage(response);
                        }
                        else {
                            const fields = channels.map(chanel => {
                                if (chanel.chanelName) {
                                    return {
                                        name: chanel.chanelName,
                                        value: '[twitch](https://www.twitch.tv/' + chanel.chanelName + ')'
                                    };
                                }
                            });

                            response.embed = {
                                color: 10065164,
                                title: 'Twitch channels',
                                description: 'List of all twitch users that I follow',
                                fields: fields.length ? fields : { name: 'No channels set', value: ' sry mate' },
                                timestamp: new Date()
                            };

                            sendMessage(response);
                        }
                    });
                return;
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

                        await db.twitchChanelCreate(params[ 1 ], !!chanelMessage ? chanelMessage : undefined)
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
            case 'taddme':
                if (!params[ 1 ] || !params[ 1 ].length) {
                    response.content = 'Twitch chanel name required mate!';
                    return sendMessage(response);
                }
                else {
                    let chanelExists = false;

                    await db.checkIfChanelExistsInDb(params[ 1 ])
                        .then(exists => {
                            chanelExists = exists;

                            if (!exists) {
                                response.content =
                                    'No channel named "' + params[ 1 ] + '"\n' +
                                    'Use `!tAdd [twitch chanel name]` to add chanel \n' +
                                    'and `!tAddMe [twitch chanel name]` to add your tag to it.\n';
                                return sendMessage(response);
                            }
                        });

                    if (chanelExists) {
                        await db.addTagToTwitchChanel(params[ 1 ], message.author.id)
                            .then(done => {
                                if (done) response.content = 'Done. You will be informed whenever ' + params[ 1 ] + '  goes live.';
                                else response.content = 'Something went wrong. Try again pls.';
                                sendMessage(response);
                            });
                    }
                }
                return;
            case 'tremoveme':
                return;
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
