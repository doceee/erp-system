class UserDeleteController {
    constructor(userRepository, httpStatusCodes, cache) {
        this.userRepository = userRepository;
        this.httpStatusCodes = httpStatusCodes;
        this.cache = cache;
    }

    async invoke(req, res) {
        const {
            loggedUser: { id: loggedUserId },
            params: { id: userId }
        } = req;

        const user = await this.userRepository.findById(userId);

        if (!user) {
            return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
        }

        if (user.id === loggedUserId) {
            return res.sendStatus(this.httpStatusCodes.FORBIDDEN);
        }

        await user.destroy();

        await this.cache.forgetByPattern('users:*');

        return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
    }
}

module.exports = UserDeleteController;
