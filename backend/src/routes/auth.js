const express = require('express');
const router = express.Router();
const authValidation = require('../validation/auth');
const validate = require('../middleware/validation');
const isLoggedIn = require('../middleware/isLoggedIn');
const resetPasswordValidator = require('../validation/resetPassword');
const changePasswordValidator = require('../validation/changePassword');
const requestResetPasswordValidator = require('../validation/requestResetPassword');

module.exports = di => {
    const loginController = di.get('controllers.auth.loginController');
    const meController = di.get('controllers.auth.meController');
    const logoutshowController = di.get('controllers.auth.logoutController');
    const requestResetPasswordController = di.get(
        'controllers.auth.requestResetPasswordController'
    );
    const resetPasswordController = di.get(
        'controllers.auth.resetPasswordController'
    );
    const changePasswordController = di.get(
        'controllers.auth.changePasswordController'
    );

    router.get('/me', [isLoggedIn], (...args) => meController.invoke(...args));

    router.post('/login', [authValidation.login, validate], (...args) =>
        loginController.invoke(...args)
    );

    router.post(
        '/reset-password',
        [requestResetPasswordValidator, validate],
        (...args) => requestResetPasswordController.invoke(...args)
    );

    router.post(
        '/reset-password/:passwordResetToken',
        [resetPasswordValidator, validate],
        (...args) => resetPasswordController.invoke(...args)
    );

    router.post(
        '/change-password',
        [isLoggedIn],
        [changePasswordValidator, validate],
        (...args) => changePasswordController.invoke(...args)
    );

    router.post('/logout', (...args) => logoutshowController.invoke(...args));

    return router;
};
