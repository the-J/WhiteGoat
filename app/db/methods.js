/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */
const sequelize = require('./init.js');

const TwitchChannels = require('./schemas.js');

// create TwitchChanel entry in DB
const twitchChanelCreate = function ( chanelName, message ) {
    if (!chanelName) return console.log('no twitch chanel name');

    return new Promise(function ( resolve, reject ) {
        sequelize.sync()
            .then(() => isChanelNameUniq(chanelName))
            .then(isUniq => isUniq ? TwitchChannels.create({ chanelName: chanelName, message }) : null)
            .then(data => data ? resolve(data.toJSON()) : resolve({ exists: true }));
    });
};

// check if chanel name is present in DB - true / false
function isChanelNameUniq( chanelName ) {
    return TwitchChannels.count({ where: { chanelName } }).then(count => count === 0);
}

// return all twitch channels collection
function allTwitchChannels() {
    return TwitchChannels.findAll({ raw: true }).then(channels => channels);
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
function removeTagToTwitchChanel( chanelName, userId ) {
    let userIds = [];
    return oneTwitchChanel(chanelName)
        .then(chanel => {
            if (chanel) {
                let newUserIds = chanel.userIds;
                for (let i = 0; i < chanel.userIds.length; i++) {
                    if (chanel.userIds[ i ] === userId) {
                        console.log('removing');
                        console.log(newUserIds, newUserIds.splice(i, 1));
                        newUserIds = newUserIds.splice(i, 1);
                    }
                }
                userIds = newUserIds;
            }
        })
        .then(() => TwitchChannels.update({ userIds }, { where: { chanelName } }))
        .then(updated => updated);
}

module.exports.twitchChanelCreate = twitchChanelCreate;
module.exports.allTwitchChannels = allTwitchChannels;
module.exports.checkIfChanelExistsInDb = checkIfChanelExistsInDb;
module.exports.oneTwitchChanel = oneTwitchChanel;
module.exports.addTagToTwitchChanel = addTagToTwitchChanel;
module.exports.removeTagToTwitchChanel = removeTagToTwitchChanel;
