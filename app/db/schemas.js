/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const Sequelize = require('sequelize');
const sequelize = require('./init.js');

const BOT = require('../credentials/botCredentials.js');
const botOwner = BOT.OWNER;

const TwitchChannels = sequelize.define('twitchchannels', {
    chanelName: Sequelize.STRING, // twitch.tv chanel name
    chanelId: Sequelize.STRING, // twitch.tv chanel id
    profileImageUrl: Sequelize.STRING, // twitch.tv profile image
    message: { type: Sequelize.STRING, defaultValue: ' is live now' }, // message to display when channel goes life
    userIds: { type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: [] }, // assigned by user, mentioned in a message
    streaming: { type: Sequelize.BOOLEAN, defaultValue: false } // update if streaming
});

const TwitchSettings = sequelize.define('twitchsettings', {
    chanelId: Sequelize.TEXT, // text channel id on which bot will answer
    admins: { type: Sequelize.ARRAY(Sequelize.TEXT), defaultValue: [] }, // bot administrators
    ownerId: { type: Sequelize.TEXT, defaultValue: botOwner } // bot administrators
});

TwitchChannels.sync({ alter: true });
TwitchSettings.sync({ alter: true });

module.exports.TwitchChannels = TwitchChannels;
module.exports.TwitchSettings = TwitchSettings;
