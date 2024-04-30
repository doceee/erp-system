class UserStoreController {
    constructor(userRepository, httpStatusCodes, cache) {
        this.userRepository = userRepository;
        this.httpStatusCodes = httpStatusCodes;
        this.cache = cache;
    }

    async invoke(req, res) {
        const user = await this.userRepository.create(req.body);

        const newUser = await this.userRepository.findById(user.id);

        await this.cache.forgetByPattern('users:*');

        return res.status(this.httpStatusCodes.CREATED).send(newUser);
    }
}

module.exports = UserStoreController;
