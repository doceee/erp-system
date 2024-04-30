class UserShowController {
    constructor(userRepository, httpStatusCodes, cache) {
        this.userRepository = userRepository;
        this.httpStatusCodes = httpStatusCodes;
        this.cache = cache;
    }

    async invoke(req, res) {
        const { id } = req.params,
            cacheKey = 'users:show:' + id,
            isCachedData = await this.cache.exists(cacheKey);

        if (isCachedData) {
            const user = await this.cache.get(cacheKey);

            return res.send(user);
        }

        const user = await this.userRepository.findById(id);

        if (!user) {
            return res.sendStatus(this.httpStatusCodes.NOT_FOUND);
        }

        await this.cache.set(cacheKey, user);

        return res.send(user);
    }
}

module.exports = UserShowController;
