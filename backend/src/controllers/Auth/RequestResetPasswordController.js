const dayjs = require('dayjs');
const config = require('../../config');

class RequestResetPasswordController {
    constructor(
        userRepository,
        mailer,
        resetPasswordMail,
        passwordResetTokenGeneratorHandler,
        httpStatusCodes
    ) {
        this.userRepository = userRepository;
        this.mailer = mailer;
        this.resetPasswordMail = resetPasswordMail;
        this.passwordResetTokenGeneratorHandler =
            passwordResetTokenGeneratorHandler;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { email } = req.body;

        const user = await this.userRepository.findOne({
            where: {
                email
            }
        });

        if (!user) {
            return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
        }

        const passwordResetToken =
            await this.passwordResetTokenGeneratorHandler.handle();

        const passwordResetTokenExpiresAt = dayjs().add(1, 'day');

        await user.update({ passwordResetToken, passwordResetTokenExpiresAt });

        const mailContent = this.resetPasswordMail.generateMessage({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            token: passwordResetToken,
            frontendUrl: config.frontendUrl
        });

        await this.mailer.sendMail(mailContent);

        return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
    }
}

module.exports = RequestResetPasswordController;
