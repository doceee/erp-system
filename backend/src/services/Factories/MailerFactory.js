class MailerFactory {
    static create(config, nodemailer) {
        return nodemailer.createTransport({ ...config.mail });
    }
}

module.exports = MailerFactory;
