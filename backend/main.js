const config = require('./.config.js');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const favicon = require('serve-favicon')

const logger = require('./app/components/logger')('server');
const session = require('./app/components/session');
const router = require('./app/router');

const app = express();
app.disable('x-powered-by');
app.use(session);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(favicon(__dirname + '/public/favicon.png'));

app.use(router);

http.createServer(app).listen(config.server.port, () => {
    logger.info("Started on port", config.server.port);
});
