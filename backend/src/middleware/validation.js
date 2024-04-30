const { StatusCodes } = require('http-status-codes');
const { matchedData, validationResult } = require('express-validator');

module.exports = async (req, res, next) => {
    const validationErrors = validationResult(req);

    if (validationErrors.isEmpty()) {
        req.body = matchedData(req);

        return next();
    }

    const errors = validationErrors.array().map(e => {
        return { message: e.msg, param: e.param };
    });

    return res.status(StatusCodes.BAD_REQUEST).json({ errors });
};
