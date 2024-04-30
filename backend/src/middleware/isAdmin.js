const { StatusCodes } = require('http-status-codes');

async function isAdmin(req, res, next) {
    const { loggedUser } = req;

    if (!loggedUser) {
        return res.sendStatus(StatusCodes.UNAUTHORIZED);
    }

    if (!(await loggedUser.isAdmin())) {
        return res.sendStatus(StatusCodes.FORBIDDEN);
    }

    return next();
}

module.exports = isAdmin;
