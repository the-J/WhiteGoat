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
    if (!chanelName) {
        console.log('no twitch chanel name');
    }
    sequelize.sync()
        .then(() => TwitchChanelCreate.create({
            chanelName: chanelName
        }))
        .then(stream => {
            console.log(stream.toJSON() + ' created');
        });
};

module.exports.userCreate = userCreate;
module.exports.twitchChanelCreate = twitchChanelCreate;
