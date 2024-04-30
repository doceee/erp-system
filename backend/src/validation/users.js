const { body } = require('express-validator');
const { withPassword } = require('./auth');

async function isEmailRegistered(email, userID, di) {
    const userRepository = di.get('repositories.user');

    const registeredUser = await userRepository.findOne({
        where: {
            email
        }
    });

    if (registeredUser && registeredUser.id !== userID) {
        throw new Error('Email is already registered.');
    }
}

const baseValidation = [
    body(['firstName'])
        .exists()
        .withMessage('First Name field is required.')
        .bail()
        .isLength({ min: 3, max: 10 })
        .withMessage(
            'First Name field must contain at least 3 characters (can not exceed 10 characters).'
        )
        .bail()
        .isString()
        .withMessage('First Name must be of type string.'),

    body(['lastName'])
        .exists()
        .withMessage('Last Name field is required.')
        .bail()
        .isLength({ min: 3, max: 10 })
        .withMessage(
            'Last Name field must contain at least 3 characters (can not exceed 10 characters).'
        )
        .isString()
        .withMessage('Last Name must be of type string.'),

    body(['birthday'])
        .exists()
        .withMessage('Birthday field is required.')
        .bail()
        .isISO8601()
        .toDate()
        .withMessage('Incorrect date format.'),

    body('email')
        .exists()
        .withMessage('Email field is required.')
        .bail()
        .isEmail()
        .withMessage('Incorrect email format.')
        .bail()
        .custom((email, { req }) =>
            isEmailRegistered(email, req.params.id, req.app.get('di'))
        )
];

const update = [...baseValidation];

const create = [...baseValidation, ...withPassword];

module.exports = { create, update };
