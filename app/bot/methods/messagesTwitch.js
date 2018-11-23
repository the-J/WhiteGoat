/**
 * Created by juliusz.jakubowski@gmail.com on 18.11.18.
 */

const messages = require('./messages.js');
const twitchListener = require('./twitchListener.js');
const twitch = require('../../twitch/apiMethods.js');
const db = require('../../db/methods.js');
const BOT = require('../../credentials/botCredentials.js');

const prefix = BOT.PREFIX;
const owner = BOT.OWNER;

const twitchManual =
    'Twitch commands manual\n' +
    '```diff\n' +
    '+ NOTE\n' +
    ' - commands are not case sensitive;\n' +
    ' - remember about the prefix: ' + prefix + '\n' +
    ' - params: [] - is required; () - is optional; else - doesn\'t take params\n\n\n' +
    '+ COMMANDS\n' +
    ' * tMan\n' +
    '       this manual;\n' + // done
    ' * tChannels \n' +
    '       list of twitch saved channels;\n' + // done
    ' * tAdd [chanel name] (message) \n' +
    '       twitch stream listener;\n' + // done
    ' * tAddMe [chanel name] \n' +
    '       will notify you when selected twitch chanel goes live;\n' + // done
    ' * tRemoveMe [chanel name] \n' +
    '       ~tAddMe;\n' + // done
    ' * tRemoveMeAll \n' +
    '       removes your tag from every twitch chanel;\n' + // done
    ' * tMine \n' +
    '       channels that will notify you;\n\n\n' + // done
    '```';

const twitchAdminCommands =
    '```diff\n' +
    '+ ADMIN RESTRICTED\n ' +
    ' * tRemove [chanel name] \n ' +
    '       channels that will notify you;\n ' + // done
    ' * tStart \n ' +
    '       start twitch listener;\n ' + // done
    ' * tStop \n ' +
    '       stop twitch listener;\n ' + // done
    '```';

/**
 *
 * @param {Object} message
 *      channel.id - where response will be send
 *      message = {
 *              author: { bot: false },
 *              channel: { id: 'XXXX' },
 *              content: prefix + command + params[1,...n]
 *      };
 * @param {Object} response
 * @return {Promise<void>}
 */
const handleTwitchMessage = async function ( message, response ) {
    const params = message.content.split(' ');
    const key = params[ 0 ].substring(1).toLowerCase();

    switch (key) {
        case 'tchannels':
            return await tChannels(response).then(response => messages.sendMessage(response));
        case 'tadd':
            if (!params[ 1 ] || !params[ 1 ].length) {
                response.content = 'Twitch chanel name required mate!';
                return messages.sendMessage(response);
            }

            return await tAdd(params, response).then(response => messages.sendMessage(response));
        case 'taddme':
            if (!params[ 1 ] || !params[ 1 ].length) {
                response.content = 'Twitch chanel name required mate!';
                return messages.sendMessage(response);
            }

            return await tAddMe(params, message.author.id, response).then(response => messages.sendMessage(response));
        case 'tremoveme':
            if (!params[ 1 ] || !params[ 1 ].length) {
                response.content = 'Yo, Give Me twitch chanel name!';
                return messages.sendMessage(response);
            }

            return await tRemoveMe(params, message.author.id, response).then(response => messages.sendMessage(response));
        case 'tremovemeall':
            response.content = 'Give me a sec...';
            messages.sendMessage(response);
            return await tRemoveMeAll(message.author.id, response).then(response => messages.sendMessage(response));
        case 'tmine':
            response.content = 'I\'m on it...';
            messages.sendMessage(response);
            return await tMine(message.author.id, response).then(response => messages.sendMessage(response));
        case 'tman':
            if (message.author.id === owner) {
                response.content = twitchManual + '\n' + twitchAdminCommands;
                return messages.sendMessage(response);
            }
            response.content = twitchManual;
            response.author = '';
            return messages.sendMessage(response);
        case 'tremove':
            if (message.author.id === owner) {
                return await tRemove(params[ 1 ], response)
                    .then(response => {
                        twitchListener.updateTwitchListener();
                        return messages.sendMessage(response);
                    });
            }

            response.content = 'I don\'t think so.';
            messages.sendMessage(response);
            return;
        case 'tstop':
            if (message.author.id === owner) {
                return await twitchListener.stopTwitchListener()
                    .then(updateMessage => {
                        response.content = updateMessage;
                        return messages.sendMessage(response);
                    });
            }

            response.content = 'I don\'t think so.';
            messages.sendMessage(response);
            return;
        case 'tstart':
            if (message.author.id === owner) {
                return await twitchListener.startTwitchListener()
                    .then(() => {
                        response.content = 'Listener started';
                        return messages.sendMessage(response);
                    });
            }

            response.content = 'I don\'t think so.';
            messages.sendMessage(response);
            return;
        default:
            response.content = 'I dont get it, could you repeat ' + message.author + ', pls?';
            response.author = '';
            return messages.sendMessage(response);
    }
};

async function tChannels( response ) {
    return await db.allTwitchChannels()
        .then(channels => {
            if (!channels.length) {
                response.content = 'Sry, no channels in my DB.';
                return response;
            }

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

            return response;
        });
}

async function tAdd( params, response ) {
    let userExist = false;
    let chanelId = null;
    let profileImage = null;

    await twitch.checkIfUserExists(params[ 1 ])
        .then(result => {
                if (!result.data.length) {
                    response.content = 'No such user on twitch ' + params[ 1 ] + ' mate! Try again.';
                }
                else {
                    chanelId = result.data[0].id;
                    profileImage = result.data[0].profile_image_url;
                    userExist = true;
                }
            },
            err => response.content = 'Oy! Got some error: ' + err.message);


    if (userExist) {
        const chanelMessage = params.slice(2).join(' ');

        return await db.twitchChanelCreate(params[ 1 ], chanelId, profileImage,  !!chanelMessage ? chanelMessage : undefined)
            .then(
                result => {
                    if (result.id) {
                        response.content = 'Added ' + params[ 1 ] + ' to database. I will keep eye on him';
                        return response;
                    }
                    else if (result.exists) {
                        response.content = 'I already got ' + params[ 1 ] + ' on my watchlist.';
                        return response;
                    }
                    else {
                        response.content = 'Dunno what happened, try again';
                        return response;
                    }
                },
                err => {
                    response.content = 'Oy! Got some error: ' + err.message;
                    return response;
                }
            );
    }
    else {
        return response;
    }
}

async function tAddMe( params, author, response ) {
    let chanelExists = false;

    await db.checkIfChanelExistsInDb(params[ 1 ]).then(exists => chanelExists = exists);

    if (chanelExists) {
        return await db.addTagToTwitchChanel(params[ 1 ], author)
            .then(done => {
                if (done) response.content = 'Done. You will be informed whenever ' + params[ 1 ] + '  goes live.';
                else response.content =
                    'You where not assigned or something went wrong\n' +
                    'Check `!tMine` to see if you are.';

                return response;
            });
    }

    response.content =
        'No channel named "' + params[ 1 ] + '"\n' +
        'Use `!tAdd [ twitch chanel name ]` to add chanel \n' +
        'and `!tAddMe [ twitch chanel name]` to add your tag to it.\n';

    return response;
}

async function tRemoveMe( params, author, response ) {
    let chanelExists = false;

    await db.checkIfChanelExistsInDb(params[ 1 ])
        .then(exists => {
            chanelExists = exists;

            if (!exists) {
                response.content = 'No channel named "' + params[ 1 ] + '" so I can\'t remove you\n';
            }
        });

    if (chanelExists) {
        return await db.removeTagFromOneTwitchChanel(params[ 1 ], author)
            .then(done => {
                if (done) response.content = 'Removed you from ' + params[ 1 ] + ' notification message.';
                else response.content = 'Something went wrong. Try again pls.';
                return response;
            });
    }

    return response;
}

async function tRemoveMeAll( author, response ) {
    let remove = false;

    await db.checkIfTwitchCollectionIsNotEmpty()
        .then(numberOfEntries => {
            if (numberOfEntries === 0) {
                response.content = 'No channels stored in DB';
            }
            else {
                remove = !!numberOfEntries;
            }
        });

    if (remove) {
        return await db.removeTagFromAllTwitchChannels(author)
            .then(done => {
                if (done >= 0) response.content = 'Removed you from all notification messages.';
                else response.content = 'Something went wrong. Try again pls.';
                return response;
            });
    }

    return response;
}

async function tMine( author, response ) {
    let notEmpty = false;

    await db.checkIfTwitchCollectionIsNotEmpty()
        .then(numberOfEntries => {
            if (numberOfEntries === 0) {
                response.content = 'No channels stored in DB';
            }
            else notEmpty = numberOfEntries;
        });

    if (notEmpty) {
        return await db.allTwitchChannelsWithMyTag(author)
            .then(channels => {
                if (channels.length >= 1) {
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
                        title: 'Twitch channels that you follow:',
                        fields,
                        timestamp: new Date()
                    };
                }
                else if (channels.length === 0) response.content = 'You got no subscriptions man! Better change that!';
                else response.content = 'Something went wrong. Try again pls.';

                return response;
            });
    }

    return response;
}

async function tRemove( chanelName, response ) {
    let chanelExists = false;

    await db.checkIfChanelExistsInDb(chanelName)
        .then(exists => {
            chanelExists = exists;

            if (!exists) {
                response.content = 'No channel named "' + chanelName + '" so I can\'t remove it\n';
            }
        });

    if (chanelExists) {
        return await db.removeTwitchChanel(chanelName)
            .then(done => {
                if (done) response.content = 'Removed ' + chanelName + ' from DB.';
                else response.content = 'Something went wrong. Try again pls.';
                return response;
            });
    }

    return response;
}

module.exports.handleTwitchMessage = handleTwitchMessage;
