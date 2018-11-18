/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const Sequelize = require('sequelize');
const sequelize = require('./init.js');

const User = sequelize.define('user', {
    username: Sequelize.STRING,
    birthday: Sequelize.DATE
});

const TwitchChanelCreate = sequelize.define('twitchStream', {
    chanelName: Sequelize.STRING
});

module.exports = User;
module.exports = TwitchChanelCreate ;
