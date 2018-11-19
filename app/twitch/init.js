/**
 * Created by juliusz.jakubowski@gmail.com on 19.11.18.
 */

const messages = require('../bot/methods/messages.js');
const twitchCredentials = require('../credentials/twitchCredentials');
const request = require('request');

function getTwitchData() {
    console.log('getJson fired');

    var result = 'ERROR';

    request.get(url(), function ( error, response, body ) {
        try {
            var result = JSON.parse(body);
        } catch (err) {
            console.log('Sorry, something seems to have malfunctioned while getting the streamers');
        }

        // result = d.streams[0].channel.display_name;
        console.log('result data', result.data);

        // for(var i = 0; i < limit; i++){
        //     streamers.push(d.streams[i].channel.display_name)
        // }
        // streamers.push(result);
        // if (streamers.length <= 0){
        //     callback("ERROR");
        // }else{
        //     callback("SUCCESS got streamers " + result);
        // }

    });

    // if (streamers.length < 0) {
    //     callback('ERROR');
    // }
    // else {
    //     callback('SUCCESS got streamers ' + result);
    // }
}

function url() {
    return {
        url: 'https://api.twitch.tv/helix/users?login=made_by_j&login=st4s1o&login=splispli',
        headers: {
            'Client-ID': twitchCredentials.CLIENTID,
            'token': twitchCredentials.TOKEN,
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };
}

const streamListener = () => {
    return;
    setInterval(() => getTwitchData(), 2000);
}
const stopListener = () => {
    console.log(streamListener);
    // streamListener.clearInterval();
}

const restartListener = '';

module.exports.startListenStreams = streamListener;
module.exports.stopListener = stopListener;
