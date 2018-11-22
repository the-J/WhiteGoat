/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */
const TwitchChannels = require('./schemas.js');
const sequelize = require('./init.js');
const twitchListener = require('../bot/methods/twitchListener.js');

// create TwitchChanel entry in DB
const twitchChanelCreate = function ( chanelName, chanelId, profileImageUrl, message ) {
    if (!chanelName) return console.log('no twitch chanel name');

    return new Promise(function ( resolve, reject ) {
        sequelize.sync()
            .then(() => isChanelNameUniq(chanelName))
            .then(isUniq => isUniq ? TwitchChannels.create({ chanelName, chanelId, profileImageUrl, message }) : null)
            .then(data => {
                if (data) {
                    const raw = data.toJSON();
                    twitchListener.updateTwitchListener(raw);
                    resolve(raw);
                }
                else resolve({ exists: true });
            });
    });
};

// check if chanel name is present in DB - true / false
function isChanelNameUniq( chanelName ) {
    return TwitchChannels.count({ where: { chanelName } }).then(count => count === 0);
}

// check if collection is not empty
function checkIfTwitchCollectionIsNotEmpty() {
    return TwitchChannels.count().then(count => count);
}

// return all twitch channels collection
function allTwitchChannels( attributes ) {
    if (attributes) return TwitchChannels.findAll({ attributes, raw: true }).then(channels => channels);
    else return TwitchChannels.findAll({ raw: true }).then(channels => channels);
}

// retrieve one twitch chanel from collection
function oneTwitchChanel( chanelName ) {
    return TwitchChannels.findOne({ where: { chanelName }, raw: true }).then(channels => channels);
}

// probably duplication - isChanelNameUniq
function checkIfChanelExistsInDb( chanelName ) {
    return TwitchChannels.count({ where: { chanelName } }).then(count => !!count);
}

// append users id to userIds values if it is not present already
function addTagToTwitchChanel( chanelName, userId ) {
    return TwitchChannels.update(
        { userIds: sequelize.fn('array_append', TwitchChannels.sequelize.col('userIds'), userId) },
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
        .then(() => TwitchChannels.update({ userIds: userIds }, { where: { chanelName } }))
        .then(updated => updated);
}

function removeTagFromAllTwitchChannels( userId ) {
    let updateChannels = [];
    let update = 0;

    return TwitchChannels.findAll({ attributes: [ 'id', 'userIds' ], raw: true })
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
                TwitchChannels.update(
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
    return TwitchChannels.findAll({
            where: { userIds: { $contains: [ userId ] } },
            attributes: [ 'chanelName' ],
            raw: true
        }
    ).then(channels => channels);
}

function removeTwitchChanel( chanelName ) {
    return TwitchChannels.destroy({ where: { chanelName } }).then(removed => !!removed);
}

function setIfIsStreaming( chanelName, isStreaming ) {
    return TwitchChannels.update({ streaming: isStreaming }, { fields: [ 'streaming' ], where: { chanelName } });
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
module.exports.setIfIsStreaming = setIfIsStreaming;
