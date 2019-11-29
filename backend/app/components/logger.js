const {
    LoggerFactory
} = require('../lib/Loggery');
const config = require('../../.config');

const factory = new LoggerFactory({
    path: config.server.logs
});

module.exports = (source) => {
    return factory.new(source);
};
