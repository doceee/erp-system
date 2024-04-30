const { body } = require('express-validator');
const uuidValidator = require('../validation/uuid');
const isUserRegistered = require('./helpers/isUserRegistered');
const { Op } = require('sequelize');
const dayjs = require('dayjs');

function isAfterStartDate(startDate, endDate) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const isAfter = end.isAfter(start);

    if (!isAfter) {
        throw new Error('End date must be after start date.');
    } else {
        return true;
    }
}

async function isDateBetweenOtherContract(contractData, contractId, di) {
    const contractRepository = di.get('repositories.contract');
    const calculateDatesHandler = di.get('services.calculateDatesHandler');
    const { startDate, endDate, duration, userId } = contractData;
    const { calcEndDate } = calculateDatesHandler.handle(
        startDate,
        endDate,
        duration
    );
    const calcStartDate = dayjs(startDate).format('YYYY-MM-DD');

    const where = {
        userId,
        [Op.or]: [
            {
                startDate: {
                    [Op.between]: [calcStartDate, calcEndDate]
                }
            },
            {
                endDate: {
                    [Op.between]: [calcStartDate, calcEndDate]
                }
            },
            {
                [Op.and]: {
                    startDate: {
                        [Op.lte]: calcStartDate
                    },
                    endDate: {
                        [Op.gte]: calcEndDate
                    }
                }
            }
        ]
    };

    if (contractId) {
        where.id = { [Op.ne]: contractId };
    }

    const contracts = await contractRepository.findAll({
        where
    });

    if (contracts.length) {
        throw new Error(
            'Contract duration can not be between start date and end date of the other contract.'
        );
    }
}

const create = [
    body(['userId'])
        .exists()
        .withMessage('User ID is required.')
        .bail()
        .custom(userId => uuidValidator(userId))
        .bail()
        .custom((userId, { req }) =>
            isUserRegistered(userId, req.app.get('di'))
        ),

    body(['position'])
        .exists()
        .withMessage('Position field is required.')
        .bail()
        .isLength({ min: 3, max: 20 })
        .withMessage(
            'Position field must contain at least 3 characters (can not exceed 20 characters).'
        )
        .isString()
        .withMessage('Position must be of type string.'),

    body(['startDate'])
        .exists()
        .withMessage('Start date field is required.')
        .bail()
        .isISO8601()
        .toDate()
        .withMessage('Invalid date type.')
        .custom((startDate, { req }) =>
            isDateBetweenOtherContract(
                req.body,
                req.params.id,
                req.app.get('di')
            )
        ),

    body(['endDate'])
        .optional({ checkFalsy: true })
        .isISO8601()
        .toDate()
        .withMessage('Invalid date type.')
        .bail()
        .custom((endDate, { req }) =>
            isAfterStartDate(req.body.startDate, endDate)
        )
        .custom((endDate, { req }) =>
            isDateBetweenOtherContract(
                req.body,
                req.params.id,
                req.app.get('di')
            )
        ),

    body(['duration'])
        .if(body(['endDate']).isEmpty())
        .not()
        .isEmpty()
        .withMessage('This field is required if End date field is not set.')
        .bail()
        .isInt({ min: 1, max: 60 })
        .withMessage('Duration field must be of type number (min 1, max 60).')
        .custom((duration, { req }) =>
            isDateBetweenOtherContract(
                req.body,
                req.params.id,
                req.app.get('di')
            )
        ),

    body(['vacationDaysPerYear'])
        .exists()
        .withMessage('Vacation Days field is required.')
        .bail()
        .isIn([20, 26])
        .withMessage('Vacation Days field must be exact number (20 or 26)')
];

module.exports = create;
