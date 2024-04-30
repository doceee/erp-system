const StatusCodes = require('http-status-codes');

module.exports = (err, req, res) => {
    if (err.message === 'Not allowed by CORS') {
        return response.send('Request not allowed by CORS');
    }

    if (
        err.name === 'SequelizeValidationError' ||
        err.name === 'SequelizeUniqueConstraintError'
    ) {
        return res.sendStatus(StatusCodes.UNPROCESSABLE_ENTITY);
    }
    console.error(err);

    return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
};
