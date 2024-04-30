const cors = require('cors');
const {
    app: { frontendUrl }
} = require('../config');

module.exports = app => {
    let originsWhitelist = [frontendUrl];

    let corsOptions = {
        origin: (origin, callback) => {
            if (originsWhitelist.includes(origin) || !origin) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true
    };

    app.use(cors(corsOptions));
};
