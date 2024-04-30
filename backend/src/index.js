const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const Sentry = require('@sentry/node');
const { sentryDsn } = require('./config');

const app = express();

if (sentryDsn) {
    Sentry.init({ dsn: sentryDsn });
    app.use(Sentry.Handlers.requestHandler());
}

app.use(helmet());

const di = require('./di');
app.set('di', di);

const router = require('./routes')(di);
const errorHandler = require('./plugins/errorHandler');

require('./plugins/session')(app);
require('./plugins/cors')(app);
app.use(bodyParser.json());
app.use(express.json());

app.use('/api', router);

if (sentryDsn) {
    app.use(Sentry.Handlers.errorHandler());
}

app.use(errorHandler);

module.exports = app;
