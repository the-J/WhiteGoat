/**
 * Created by juliusz.jakubowski@gmail.com on 17.11.18.
 */

const Sequelize = require('sequelize');
const SERVER = require('./serverCredentials.js');

const sequelize = new Sequelize(
    'postgres',
    SERVER.POSTGRES_USER,
    SERVER.POSTGRES_PASS, {
        host: SERVER.POSTGRES_HOST,
        dialect: 'postgres',

        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },

        // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
        operatorsAliases: false
    });

module.exports = sequelize;
