class UserUpdateController {
    constructor(userRepository, httpStatusCodes, cache) {
        this.userRepository = userRepository;
        this.httpStatusCodes = httpStatusCodes;
        this.cache = cache;
    }

    async invoke(req, res) {
        const { id } = req.params;

        const user = await this.userRepository.findById(id);

        if (!user) {
            return res.sendStatus(this.httpStatusCodes.NOT_FOUND);
        }

        await user.update(req.body);

        await this.cache.forgetByPattern('users:*');

        const updatedUser = await this.userRepository.findById(id);

        return res.send(updatedUser);
    }
}

module.exports = UserUpdateController;
