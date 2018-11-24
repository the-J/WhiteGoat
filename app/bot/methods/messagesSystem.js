/**
 * Created by juliusz.jakubowski@gmail.com on 24.11.18.
 */

const messages = require('./messages.js');

const handleSystemMessage = async function ( message ) {
    switch (message.type) {
        case 'streamLive': {
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

            messages.sendMessage(message);

            if (mentions) {
                delete message.embed;
                message.content = mentions;
                message.author = '';
                messages.sendMessage(message);
            }

            return;
        }
    }
};

module.exports.handleSystemMessage = handleSystemMessage;
