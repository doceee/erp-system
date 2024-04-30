class ResetPasswordController {
    constructor(userRepository, httpStatusCodes) {
        this.userRepository = userRepository;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const {
            params: { passwordResetToken },
            body: { password }
        } = req;

        const user = await this.userRepository.findOne({
            attributes: ['id', 'passwordResetTokenExpiresAt'],
            where: { passwordResetToken }
        });

        if (!user) {
            return res.sendStatus(this.httpStatusCodes.NOT_FOUND);
        }

        const isTokenExpired = user.isPasswordResetTokenExpired();

        if (isTokenExpired) {
            await user.update({
                passwordResetToken: null,
                passwordResetTokenExpiresAt: null
            });

            return res.sendStatus(this.httpStatusCodes.BAD_REQUEST);
        }

        await user.update({
            password,
            passwordResetToken: null,
            passwordResetTokenExpiresAt: null
        });

        return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
    }
}

module.exports = ResetPasswordController;
