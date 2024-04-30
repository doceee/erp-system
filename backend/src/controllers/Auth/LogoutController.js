class LogoutController {
    constructor(httpStatusCodes) {
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        req.session.destroy();

        return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
    }
}

module.exports = LogoutController;
