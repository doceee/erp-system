class ChangePasswordController {
    constructor(userRepository, httpStatusCodes) {
        this.userRepository = userRepository;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { id } = req.loggedUser;

        const user = await this.userRepository.findOne({
            where: {
                id
            },
            attributes: ['id', 'password']
        });

        const { oldPassword, newPassword } = req.body;

        const isValid = await user.matchPassword(oldPassword);

        if (!isValid) {
            return res.status(this.httpStatusCodes.BAD_REQUEST).send({
                errors: [
                    {
                        message: 'Invalid password.',
                        param: 'oldPassword'
                    }
                ]
            });
        }

        await user.update({ password: newPassword });

        return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
    }
}

module.exports = ChangePasswordController;
