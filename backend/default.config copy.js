module.exports = {
    db: {
        pgsql_uri: "postgresql://username:password@ip:port/basename"
    },
    server: {
        port: 3000,
        logs: __dirname + '/logs/%level%.log'
    }
};