/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */
const schema = require('./schemas.js');
const sequelize = require('./init.js');
const twitchListener = require('../bot/methods/twitchListener.js');

const BOT = require('../credentials/botCredentials.js');

// create TwitchChanel entry in DB
const twitchChanelCreate = async function ( chanelName, chanelId, profileImageUrl, message ) {
    if (!chanelName) return console.log('no twitch chanel name');

    let chanelNameUniq = false;
    await isChanelNameUniq(chanelName)
        .then(isUniq => chanelNameUniq = isUniq)
        .catch(err => console.log('isChanelNameUniq err', { err }));


    if (chanelNameUniq) {
        return schema.TwitchChannels.create({ chanelName, chanelId, profileImageUrl, message })
            .then(data => {
                if (data) {
                    const raw = data.toJSON();
                    twitchListener.updateTwitchListener(raw);
                    return raw;
                }
                else return { exists: true };
            });
    }
};

// check if chanel name is present in DB - true / false
function isChanelNameUniq( chanelName ) {
    return schema.TwitchChannels.count({ where: { chanelName } }).then(count => count === 0);
}

// check if collection is not empty
function checkIfTwitchCollectionIsNotEmpty() {
    return schema.TwitchChannels.count().then(count => count);
}

// return all twitch channels collection
function allTwitchChannels( attributes ) {

    if (attributes) {
        return schema.TwitchChannels.findAll({
            attributes, raw: true
        })
            .then(channels => channels)
            .catch(err => console.log('asdasdasdasd', err));
    }
    else {
        return schema.TwitchChannels.findAll({ raw: true })
            .then(channels => channels)
            .catch(err => console.log('asdasdasdasd', err));
    }
}

// retrieve one twitch chanel from collection
function oneTwitchChanel( chanelName ) {
    return schema.TwitchChannels.findOne({ where: { chanelName }, raw: true }).then(channels => channels);
}

// probably duplication - isChanelNameUniq
function checkIfChanelExistsInDb( chanelName ) {
    return schema.TwitchChannels.count({ where: { chanelName } }).then(count => !!count);
}

// append users id to userIds values if it is not present already
function addTagToTwitchChanel( chanelName, userId ) {
    return schema.TwitchChannels.update(
        { userIds: sequelize.fn('array_append', schema.TwitchChannels.sequelize.col('userIds'), userId) },
        { where: { chanelName, $not: [ { userIds: { $contains: [ userId ] } } ] } }
    ).then(updated => updated);
}

// remove users id to userIds values if it is not present already
function removeTagFromOneTwitchChanel( chanelName, userId ) {
    let userIds = [];
    return oneTwitchChanel(chanelName)
        .then(chanel => {
            if (chanel) {
                let newUserIds = chanel.userIds;
                const index = newUserIds.indexOf(userId);
                if (index > -1) newUserIds.splice(index, 1);
                userIds = newUserIds;
            }
            else userIds = chanel.userIds;
        })
        .then(() => schema.TwitchChannels.update({ userIds: userIds }, { where: { chanelName } }))
        .then(updated => updated);
}

function removeTagFromAllTwitchChannels( userId ) {
    let updateChannels = [];
    let update = 0;

    return schema.TwitchChannels.findAll({ attributes: [ 'id', 'userIds' ], raw: true })
        .then(channels => {
            if (channels) {
                for (let i = 0; i < channels.length; i++) {
                    let chanel = channels[ i ];
                    let newUserIds = chanel.userIds;
                    const index = newUserIds.indexOf(userId);
                    if (index > -1) newUserIds.splice(index, 1);
                    else newUserIds = chanel.userIds;
                    updateChannels.push({ id: chanel.id, userIds: newUserIds });
                }
            }
        })
        .then(() => {

            // not really sure about this part of code....

            for (let i = 0; i < updateChannels.length; i++) {
                schema.TwitchChannels.update(
                    { userIds: updateChannels[ i ].userIds },
                    { where: { id: updateChannels[ i ].id } }
                );
                update++;
            }
        })
        .then(() => update);
}

// return all twitch channels that store my userId
function allTwitchChannelsWithMyTag( userId ) {
    return schema.TwitchChannels.findAll({
            where: { userIds: { $contains: [ userId ] } },
            attributes: [ 'chanelName' ],
            raw: true
        }
    ).then(channels => channels);
}

function removeTwitchChanel( chanelName ) {
    return schema.TwitchChannels.destroy({ where: { chanelName } }).then(removed => !!removed);
}

function setStreaming( chanelId, isStreaming ) {
    return schema.TwitchChannels.update({ streaming: isStreaming }, { fields: [ 'streaming' ], where: { chanelId } });
}

/////////////////////// BOT SETTINGS ////////////////////////
// create TwitchSettings
function createTwitchSettings() {
    return schema.TwitchSettings.findOne({ where: { ownerId: BOT.OWNER } })
        .then(data => {
            if (data) return data.toJSON();
            else {
                return schema.TwitchSettings.create({
                    ownerId: BOT.OWNER,
                    admins: [ BOT.OWNER ]
                })
                    .then(settings => settings.toJSON());
            }
        });
}

// return chanelId on which bot will be responding
function updateTwitchSettings( values = undefined ) {
    return schema.TwitchSettings.update(values, { where: { ownerId: BOT.OWNER } });
}


// return chanelId on which bot will be responding
function botTwitchSettings() {
    return schema.TwitchSettings.findOne({ where: { ownerId: BOT.OWNER }, raw: true });
}

module.exports.twitchChanelCreate = twitchChanelCreate;
module.exports.allTwitchChannels = allTwitchChannels;
module.exports.checkIfChanelExistsInDb = checkIfChanelExistsInDb;
module.exports.checkIfTwitchCollectionIsNotEmpty = checkIfTwitchCollectionIsNotEmpty;
module.exports.oneTwitchChanel = oneTwitchChanel;
module.exports.addTagToTwitchChanel = addTagToTwitchChanel;
module.exports.removeTagFromOneTwitchChanel = removeTagFromOneTwitchChanel;
module.exports.removeTagFromAllTwitchChannels = removeTagFromAllTwitchChannels;
module.exports.allTwitchChannelsWithMyTag = allTwitchChannelsWithMyTag;
module.exports.removeTwitchChanel = removeTwitchChanel;
module.exports.setStreaming = setStreaming;

module.exports.createTwitchSettings = createTwitchSettings;
module.exports.updateTwitchSettings = updateTwitchSettings;
module.exports.botTwitchSettings = botTwitchSettings;
