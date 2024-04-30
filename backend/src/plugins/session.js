const session = require('express-session');
const {
    app: { secret }
} = require('../config');

module.exports = app => {
    const di = app.get('di');

    app.use(
        session({
            name: 'sid',
            secret,
            resave: false,
            store: di.get('services.redisSession'),
            saveUninitialized: false,
            rolling: true,
            cookie: {
                httpOnly: true,
                sameSite: false,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 15
            }
        })
    );
};
