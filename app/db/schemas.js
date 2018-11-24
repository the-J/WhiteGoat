/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const Sequelize = require('sequelize');
const sequelize = require('./init.js');

const TwitchChannels = sequelize.define("TwitchChannels", {
    chanelName: Sequelize.STRING, // twitch.tv chanel name
    chanelId: Sequelize.STRING, // twitch.tv chanel id
    profileImageUrl: Sequelize.STRING, // twitch.tv profile image
    message: { type: Sequelize.STRING, defaultValue: ' is live now' }, // message to display when channel goes life
    userIds: {type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: []}, // assigned by user, mentioned in a message
    streaming: {type: Sequelize.BOOLEAN, defaultValue: false} // update if streaming
});

module.exports.TwitchChannels = TwitchChannels;
