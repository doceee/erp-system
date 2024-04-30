const { body } = require('express-validator');

module.exports = [
    body(['oldPassword'])
        .exists()
        .withMessage('Old Password is required.')
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
        ),

    body('newPassword')
        .exists()
        .withMessage('New Password field is required.')
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
        ),

    body('newPasswordRepeat')
        .exists()
        .withMessage('Repeat Password is required.')
        .bail()
        .isLength({ min: 6, max: 70 })
        .withMessage(
            'Password must contain at least 6 characters (can not exceed 70 characters).'
        )
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/
        )
        .withMessage(
            'Password should contain minimum 6 till 70 characters with at least 1 small letter, 1 capital letter, 1 integer, 1 special character.'
        )
        .custom((newPasswordRepeat, { req }) => {
            if (req.body.newPassword !== newPasswordRepeat) {
                throw new Error('Passwords do not match.');
            }

            return true;
        })
];
