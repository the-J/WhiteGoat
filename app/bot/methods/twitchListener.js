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
    await db.allTwitchChannels().then(channels => {
        twitchChannels = channels;
        twitchChannels.forEach(channel => channel.stoppedCounter = 0);
    });

    // you can make 30 requests per minute * params in one request
    const intervalTime = twitchChannels.length ? 2000 * twitchChannels.length : 1000;

    twitchInterval = setInterval(checkStreaming, 2000);
}

function updateTwitchListener() {
    clearInterval(twitchInterval);
    channelNames = [];
    startTwitchListener()
        .catch(err => console.log('updateTwitchListener', err));
}

async function checkStreaming() {
    // check local collection is streamers available
    if (twitchChannels.length) {

        // check if number of streamers didnt change
        if (twitchChannels.length !== channelNames.length) {
            channelNames = [];
            channelsUrl = '';

            // if changed -> assign values locally
            for (let i = 0; i < twitchChannels.length; i++) {
                if (i === 0) channelsUrl = twitchChannels[ i ].chanelName;
                else channelsUrl += '&user_login=' + twitchChannels[ i ].chanelName;

                channelNames.push(twitchChannels[ i ].chanelName);
            }
        }

        // check if any of stored channels streams
        await twitch.checkIfStreaming(channelsUrl)
            .then(streams => {

                // someone started streaming
                if (streams.data && streams.data.length) {
                    for (let i = 0; i < streams.data.length; i++) {

                        // this chanel started streaming
                        const twitchChanelLive = twitchChannels.find(( chanel, index ) => {
                            if (chanel.chanelId === streams.data[ i ].user_id) {
                                chanel[ 'dbIndex' ] = index;
                                return chanel;
                            }
                        });

                        // this chanel is live and isn't set in a db that it's streaming
                        if (twitchChanelLive.streaming === false && streams.data[ i ].type === 'live') {

                            twitchChannels[ twitchChanelLive.dbIndex ].streaming = true;
                            twitchChannels[ twitchChanelLive.dbIndex ].stoppedCounter = 0;

                            db.setStreaming(twitchChanelLive.chanelId, true)
                                .then(() => {
                                    const message = {
                                        system: true,
                                        chanelId: '513325451746476032',
                                        dbData: twitchChanelLive,
                                        streamData: streams.data[ i ]
                                    };

                                    messages.handleMessageAndSendResponse(message);
                                });
                        }
                    }
                }

                twitchChannels.map(( chanel, index ) => {

                    // check if is still streaming
                    const isStreaming = streams && streams.data
                        // if someone still streams
                        ? streams.data.findIndex(stream => stream.user_id === chanel.chanelId) === -1
                        // if no one is
                        : false;

                    if (chanel.streaming === true && isStreaming) {

                        chanel.stoppedCounter++;

                        if (chanel.stoppedCounter === 2) {

                            twitchChannels[ index ].streaming = false;
                            twitchChannels[ index ].stoppedCounter = 0;

                            db.setStreaming(twitchChannels[ index ].chanelId, false);
                        }
                    }
                });
            })
            .catch(err => console.log('check if streaming error', err));
    }
    else {
        clearInterval(twitchInterval);
        console.log('No one to follow, stopping twitch listener');
    }
}

function stopTwitchListener() {
    clearInterval(twitchInterval);
    const chanelIds = twitchChannels.map(chanel => chanel.chanelId);
    return db.setStreaming(chanelIds, false)
        .then(updated => {
            console.log(updated);
            return 'Listener stopped';
        });
}

module.exports.startTwitchListener = startTwitchListener;
module.exports.updateTwitchListener = updateTwitchListener;
module.exports.stopTwitchListener = stopTwitchListener;
