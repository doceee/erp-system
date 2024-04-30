class MeController {
    constructor(userRepository, httpStatusCodes) {
        this.userRepository = userRepository;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { id } = req.loggedUser;

        const user = await this.userRepository.findById(id);

        if (!user) {
            return res.sendStatus(this.httpStatusCodes.UNAUTHORIZED);
        }

        return res.send(user);
    }
}

module.exports = MeController;
