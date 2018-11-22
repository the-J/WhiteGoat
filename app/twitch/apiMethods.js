/**
 * Created by juliusz.jakubowski@gmail.com on 19.11.18.
 */

const twitchCredentials = require('../credentials/twitchCredentials');
const request = require('request');

/**
 * Twitch client request headers - without url param.
 * @type {{headers: {'Client-ID': string, token: string, Accept: string, 'Accept-Charset': string}}}
 */
let url = {
    headers: {
        'Client-ID': twitchCredentials.CLIENTID,
        'token': twitchCredentials.TOKEN,
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};


/**
 * userName param should look like:
 *      * if one param: chanelName
 *      * if more than one: twitchChanelName[1] + '&login=' + twitchChanelName[2] + ...
 * Up to 100 params
 *
 * @param {string} userName
 */
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

/**
 * Channels param should look like:
 *      * if one param: chanelName
 *      * if more than one: twitchChanelName[1] + '&user_login=' + twitchChanelName[2] + ...
 * Up to 100 params
 *
 * @param {string} channels
 */
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
