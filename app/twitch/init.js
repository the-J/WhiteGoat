/**
 * Created by juliusz.jakubowski@gmail.com on 19.11.18.
 */

const db = require('../db/methods.js');

const twitchCredentials = require('../credentials/twitchCredentials');
const request = require('request');

let url = {
    headers: {
        'Client-ID': twitchCredentials.CLIENTID,
        'token': twitchCredentials.TOKEN,
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};

function checkIfUserExists( userToTest ) {
    console.log('fired checkIfUserExists');

    url[ 'url' ] = 'https://api.twitch.tv/helix/users?login=' + userToTest;

    return new Promise(function ( resolve, reject ) {
        request.get(url, function ( err, response, body ) {
            if (err) reject(err);
            else resolve(JSON.parse(body));
        });
    });
}

function checkIfStreaming( userName ) {
    console.log('fired checkIfStreaming');

    if (!userName.length) return 'Invalid params mate!';

    url = { url: 'https://api.twitch.tv/helix/streams/user_login=' + userName };

    return new Promise(function ( resolve, reject ) {
        request.get(url, function ( err, response, body ) {
            if (err) reject(err);
            else resolve(JSON.parse(body));
        });
    });
}

const streamListener = () => {
    return;
    setInterval(() => checkIfStreaming(), 2000);
};
const stopListener = () => {
    console.log(streamListener);
    // streamListener.clearInterval();
};


module.exports.startListenStreams = streamListener;
module.exports.stopListener = stopListener;

module.exports.checkIfUserExists = checkIfUserExists;
module.exports.checkIfStreaming = checkIfStreaming;
