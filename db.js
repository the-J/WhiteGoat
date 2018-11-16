var pg = require('pg');

var config = {
    user: 'postgres',
    database: 'postgres',
    password: 'postgres',
    host: '172.27.0.2',
    port: 5432
};

var db = new pg.Pool(config);
db.connect();

module.exports = db;
