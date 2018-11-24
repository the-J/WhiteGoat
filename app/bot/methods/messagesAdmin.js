/**
 * Created by juliusz.jakubowski@gmail.com on 24.11.18.
 */
const messages = require('./messages.js');
const twitchListener = require('./twitchListener.js');
const twitch = require('../../twitch/apiMethods.js');
const dbTwitch = require('../../db/methodsTwitch.js');
const bot = require('../bot.js');
const BOT = require('../../credentials/botCredentials.js');

const prefix = BOT.PREFIX;
const owner = BOT.OWNER;

const handleAdminMessages = async function ( message ) {
    const params = message.content.split(' ');
    const key = params[ 0 ].substring(1).toLowerCase();

    const response = {
        author: message.author,
        chanelId: message.channel.id
    };

    switch (key) {
        case 'setchanelid':
            // set chanel on which bot should be responding
            if (!params[ 1 ] || !params[ 1 ].length) {

                response.content = 'I need more info, turu tutu';
                return messages.sendMessage(response);
            }

            const chanelId = params[ 1 ].substring(2, params[ 1 ].length - 1);

            await dbTwitch.updateTwitchSettings({ chanelId })
                .then(settings => {
                    if (settings) {
                        response.content = 'All set up! I\'ll respond on <#' + chanelId + '>';
                        return messages.sendMessage(response);
                    }
                })
                .catch(err => console.log('update chanelid err:', err));
            return;
    }
};

module.exports.handleAdminMessages = handleAdminMessages;
