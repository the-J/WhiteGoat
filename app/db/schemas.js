/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const Sequelize = require('sequelize');
const sequelize = require('./init.js');
//
// const User = sequelize.define('user', {
//     username: Sequelize.STRING,
//     birthday: Sequelize.DATE
// });

const TwitchChannels = sequelize.define('TwitchChannels', {
    chanelName: Sequelize.STRING,
    message: { type: Sequelize.STRING, defaultValue: 'is live now' },
    tags: {type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: []}
});

sequelize.sync();

// module.exports = User;
module.exports = TwitchChannels;
