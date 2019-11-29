const config = require('../../.config.js');
const {
    Pool
} = require('pg');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const pgPool = new Pool({
        connectionString: config.db.pgsql_uri
});
pgPool.connect();

module.exports = session({
    store: new pgSession({
        pool: pgPool,
        tableName: 'session'
    }),
    secret: 'fgjlk9dfgulks4r6fgkdfghukdjf3421guykasidif23wd7t6tgydsjg6',
    name: 'sid',
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: true
});