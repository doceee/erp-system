const { body } = require('express-validator');

const withPassword = [
    body(['password'])
        .exists()
        .withMessage('Password field is required.')
        .bail()
        .isLength({ min: 6, max: 70 })
        .withMessage(
            'Password field must contain at least 6 characters (can not exceed 70 characters).'
        )
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/
        )
        .withMessage(
            'Password should contain minimum 6 till 70 characters with at least 1 small letter, 1 capital letter, 1 integer, 1 special character.'
        )
];

const login = [
    body(['email'])
        .exists()
        .withMessage('Email field is required.')
        .bail()
        .isEmail()
        .withMessage('Incorrect email format.'),

    ...withPassword
];

module.exports = { login, withPassword };
