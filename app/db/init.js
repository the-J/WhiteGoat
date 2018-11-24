/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// for safe use of literal operator aliases
// http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
const operatorsAliases = {
    $eq: Op.eq,
    $ne: Op.ne,
    $gte: Op.gte,
    $gt: Op.gt,
    $lte: Op.lte,
    $lt: Op.lt,
    $not: Op.not,
    $in: Op.in,
    $notIn: Op.notIn,
    $is: Op.is,
    $like: Op.like,
    $notLike: Op.notLike,
    $iLike: Op.iLike,
    $notILike: Op.notILike,
    $regexp: Op.regexp,
    $notRegexp: Op.notRegexp,
    $iRegexp: Op.iRegexp,
    $notIRegexp: Op.notIRegexp,
    $between: Op.between,
    $notBetween: Op.notBetween,
    $overlap: Op.overlap,
    $contains: Op.contains,
    $contained: Op.contained,
    $adjacent: Op.adjacent,
    $strictLeft: Op.strictLeft,
    $strictRight: Op.strictRight,
    $noExtendRight: Op.noExtendRight,
    $noExtendLeft: Op.noExtendLeft,
    $and: Op.and,
    $or: Op.or,
    $any: Op.any,
    $all: Op.all,
    $values: Op.values,
    $col: Op.col
};

const SERVER = require('../credentials/serverCredentials.js');
const schemas = require('./schemas.js');

const sequelize = new Sequelize(
    SERVER.POSTGRES_DATABASE,
    SERVER.POSTGRES_USER,
    SERVER.POSTGRES_PASSWORD, {
        host: SERVER.POSTGRES_HOST,
        dialect: 'postgres',

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

        operatorsAliases
    }
);

const TwitchChannels = schemas.TwitchChannels;
TwitchChannels.sync();

module.exports = sequelize;
