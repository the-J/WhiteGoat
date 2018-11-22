/**
 * Created by juliusz.jakubowski@gmail.com on 22.11.18.
 */

const db = require('../../db/methods');
const messages = require('./messages.js');
const twitch = require('../../twitch/apiMethods.js');

let twitchChannels = [];
let channelNames = [];
let channelsUrl = '';
let twitchInterval;

async function startTwitchListener() {

    console.log('starting twitch listener');

    await db.allTwitchChannels().then(channels => twitchChannels = channels);

    // you can make 30 requests per minute * params in one request
    const intervalTime = twitchChannels.length ? 2000 * twitchChannels.length : 1000;

    twitchInterval = setInterval(checkStreaming, 2000);
}


function updateTwitchListener( chanel ) {
    clearInterval(twitchInterval);
    console.log('updating stream listener');

    twitchChannels.push(chanel);

    const intervalTime = 2000 * twitchChannels.length;

    twitchInterval = setInterval(checkStreaming, 2000);
}

async function checkStreaming() {
    if (twitchChannels.length) {
        if (twitchChannels.length !== channelNames.length) {
            channelNames = [];
            channelsUrl = '';

            for (let i = 0; i < twitchChannels.length; i++) {
                if (i === 0) channelsUrl = twitchChannels[ i ].chanelName;
                else channelsUrl += '&user_login=' + twitchChannels[ i ].chanelName;

                channelNames.push(twitchChannels[ i ].chanelName);
            }
        }

        await twitch.checkIfStreaming(channelsUrl)
            .then(streams => {
                console.log('stream', streams.data);
                console.log('twitchChannels', twitchChannels);

                if (streams.data.length) {
                    streams.data.map(async stream => {
                        if (stream.type && stream.type === 'live') {
                            const chanelName = stream.user_name;
                            db.setIfIsStreaming(chanelName, true);
                            const message = {
                                author: { bot: false },
                                channel: { id: '513325451746476032' },
                                content: '!isstreaming ' + chanelName
                            };

                            await messages.handleMessageAndSendResponse(message);
                        }
                    });
                }
            });
    }
    else {
        clearInterval(twitchInterval);
        console.log('No one to follow, stopping twitch listener');
    }
}

module.exports.startTwitchListener = startTwitchListener;
module.exports.updateTwitchListener = updateTwitchListener;
