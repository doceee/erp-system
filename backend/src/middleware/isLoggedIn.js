const { StatusCodes } = require('http-status-codes');

async function isLoggedIn(req, res, next) {
    const { user } = req.session;
    const di = req.app.get('di');
    const userRepository = di.get('repositories.user');

    if (user) {
        const loggedUser = await userRepository.findById(user.id);

        if (loggedUser) {
            req.loggedUser = loggedUser;

            return next();
        }
    }

    return res.sendStatus(StatusCodes.UNAUTHORIZED);
}

module.exports = isLoggedIn;
