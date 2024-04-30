module.exports = {
    services: {
        'controllers.auth.loginController': {
            class: 'controllers/Auth/LoginController',
            arguments: ['@repositories.user', '%http-status-codes']
        },
        'controllers.auth.meController': {
            class: 'controllers/Auth/MeController',
            arguments: ['@repositories.user', '%http-status-codes']
        },
        'controllers.auth.logoutController': {
            class: 'controllers/Auth/LogoutController',
            arguments: ['%http-status-codes']
        },
        'controllers.auth.requestResetPasswordController': {
            class: 'controllers/Auth/RequestResetPasswordController',
            arguments: [
                '@repositories.user',
                '@services.nodemailer',
                '@mails.passwordReset',
                '@services.passwordResetTokenGeneratorHandler',
                '%http-status-codes'
            ]
        },
        'controllers.auth.resetPasswordController': {
            class: 'controllers/Auth/ResetPasswordController',
            arguments: ['@repositories.user', '%http-status-codes']
        },
        'controllers.auth.changePasswordController': {
            class: 'controllers/Auth/ChangePasswordController',
            arguments: ['@repositories.user', '%http-status-codes']
        }
    }
};
