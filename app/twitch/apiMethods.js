/**
 * Created by juliusz.jakubowski@gmail.com on 19.11.18.
 */

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

function checkIfUserExists( userName ) {
    if (!userName.length) return 'Invalid params mate!';

    url[ 'url' ] = 'https://api.twitch.tv/helix/users?login=' + userName;

    return new Promise(function ( resolve, reject ) {
        request.get(url, function ( err, response, body ) {
            if (err) reject(err);
            else resolve(JSON.parse(body));
        });
    });
}

function checkIfStreaming( channels ) {
    if (!channels.length) return 'Invalid params mate!';
    console.log('twitch api', { channels });

    url[ 'url' ] = 'https://api.twitch.tv/helix/streams?user_login=' + channels;

    return new Promise(function ( resolve, reject ) {
        request.get(url, function ( err, response, body ) {
            if (err) reject(err);
            else resolve(JSON.parse(body));
        });
    });
}

module.exports.checkIfUserExists = checkIfUserExists;
module.exports.checkIfStreaming = checkIfStreaming;
