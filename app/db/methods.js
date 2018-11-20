/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const sequelize = require('./init.js');

const User = require('./schemas.js');
const TwitchChannels = require('./schemas.js');
//
// const userCreate = function ( username, birthday = new Date(1980, 6, 20) ) {
//     sequelize.sync()
//         .then(() => User.create({
//             username: username,
//             birthday: birthday
//         }))
//         .then(user => {
//             console.log(user.toJSON());
//         });
// };

const twitchChanelCreate = function ( chanelName, message ) {
    if (!chanelName) return console.log('no twitch chanel name');

    return new Promise(function ( resolve, reject ) {
        sequelize.sync()
            .then(() => isChanelNameUniq(chanelName))
            .then(isUniq => isUniq ? TwitchChannels.create({ chanelName: chanelName, message }) : null)
            .then(data => data ? resolve(data.toJSON()) : resolve({ exists: true }));
    });
};

function isChanelNameUniq( chanelName ) {
    return TwitchChannels.count({ where: { chanelName } }).then(count => count === 0);
}

module.exports.userCreate = userCreate;
module.exports.twitchChanelCreate = twitchChanelCreate;
