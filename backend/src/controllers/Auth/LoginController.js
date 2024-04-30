class LoginController {
    constructor(userRepository, httpStatusCodes) {
        this.userRepository = userRepository;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { email, password } = req.body;

        const user = await this.userRepository.findOne({
            attributes: ['password'],
            where: {
                email
            }
        });

        if (!user) {
            return res.sendStatus(this.httpStatusCodes.UNAUTHORIZED);
        }

        const validPassword = await user.matchPassword(password);

        if (!validPassword) {
            return res.sendStatus(this.httpStatusCodes.UNAUTHORIZED);
        }

        const authorizedUser = await this.userRepository.findOne({
            where: {
                email
            }
        });

        req.session.user = authorizedUser;

        return res.send(authorizedUser);
    }
}

module.exports = LoginController;
