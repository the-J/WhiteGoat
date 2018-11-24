/**
 * Created by juliusz.jakubowski@gmail.com on 22.11.18.
 */

const dbTwitch = require('../../db/methodsTwitch');
const messages = require('./messages.js');
const twitch = require('../../twitch/apiMethods.js');

let twitchChannels = [];
let channelNames = [];
let channelsUrl = '';
let twitchInterval;
let botSettings;

async function startTwitchListener() {
    if (!botSettings || !botSettings.chanelId) {
        await dbTwitch.botTwitchSettings().then(settings => botSettings = settings);
    }

    if (!botSettings || !botSettings.chanelId) {
        return console.log('no bot settings, stopping this one');
    }

    await dbTwitch.allTwitchChannels()
        .then(channels => {
            twitchChannels = channels;
            twitchChannels.forEach(channel => channel.stoppedCounter = 0);
        });

    return twitchInterval = setInterval(checkStreaming, 5000);
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

                        // this chanel is live and isn't set in a dbTwitch that it's streaming
                        if (twitchChanelLive.streaming === false && streams.data[ i ].type === 'live') {

                            twitchChannels[ twitchChanelLive.dbIndex ].streaming = true;
                            twitchChannels[ twitchChanelLive.dbIndex ].stoppedCounter = 0;

                            dbTwitch.setStreaming(twitchChanelLive.chanelId, true)
                                .then(() => {
                                    const message = {
                                        system: true,
                                        type: 'streamlive',
                                        chanelId: botSettings.chanelId,
                                        dbData: twitchChanelLive,
                                        streamData: streams.data[ i ]
                                    };
                                    messages.handleMessage(message);
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

                            dbTwitch.setStreaming(twitchChannels[ index ].chanelId, false);
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
    return dbTwitch.setStreaming(chanelIds, false).then(() => 'Listener stopped');
}

module.exports.startTwitchListener = startTwitchListener;
module.exports.updateTwitchListener = updateTwitchListener;
module.exports.stopTwitchListener = stopTwitchListener;
