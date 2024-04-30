const { body, param } = require('express-validator');

module.exports = [
    param('passwordResetToken')
        .exists()
        .withMessage('Password reset token is required.'),

    body(['password']).exists().withMessage('Password is required.'),

    body(['confirmPassword'])
        .exists()
        .withMessage('Password confirmation is required.')
        .custom(
            (confirmPassword, { req }) => confirmPassword === req.body.password
        )
        .withMessage('Password confirmation must match password.')
];
