/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const sequelize = require('./init.js');

const User = require('./schemas.js');
const TwitchChanelCreate = require('./schemas.js');

const userCreate = function ( username, birthday = new Date(1980, 6, 20) ) {
    sequelize.sync()
        .then(() => User.create({
            username: username,
            birthday: birthday
        }))
        .then(user => {
            console.log(user.toJSON());
        });
};

const twitchChanelCreate = function ( chanelName ) {
    if (!chanelName) return console.log('no twitch chanel name');

    return new Promise(function ( resolve, reject ) {
        sequelize.sync()
            .then(() => isChanelNameUniq(chanelName))
            .then(isUniq => isUniq ? TwitchChanelCreate.create({ chanelName: chanelName }) : null)
            .then(data => data ? resolve(data.toJSON()) : resolve({ exists: true }));
    });
};

function isChanelNameUniq( chanelName ) {
    return TwitchChanelCreate.count({ where: { chanelName } }).then(count => count === 0);
}

module.exports.userCreate = userCreate;
module.exports.twitchChanelCreate = twitchChanelCreate;
