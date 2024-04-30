const { body } = require('express-validator');
const uuidValidator = require('./uuid');
const { Op } = require('sequelize');
const isUserRegistered = require('./helpers/isUserRegistered');
const dayjs = require('dayjs');
const isSameOrAfter = require('dayjs/plugin/isSameOrAfter');
dayjs.extend(isSameOrAfter);

function isSameOrAfterStartDate(startDate, endDate) {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const isSameOrAfterStart = end.isSameOrAfter(start, 'day');

    if (!isSameOrAfterStart) {
        throw new Error('End date must be the same or after start date.');
    } else {
        return true;
    }
}

async function isDateBetweenOtherVacation(vacationData, vacationId, di) {
    const vacationRepository = di.get('repositories.vacation');
    const { startDate, endDate, userId } = vacationData;
    let dayjsStartDate = dayjs(startDate).format('YYYY-MM-DD');
    let dayjsEndDate = dayjs(endDate).format('YYYY-MM-DD');

    const where = {
        userId,
        [Op.or]: [
            {
                startDate: {
                    [Op.between]: [dayjsStartDate, dayjsEndDate]
                }
            },
            {
                endDate: {
                    [Op.between]: [dayjsStartDate, dayjsEndDate]
                }
            },
            {
                [Op.and]: {
                    startDate: {
                        [Op.lte]: dayjsStartDate
                    },
                    endDate: {
                        [Op.gte]: dayjsEndDate
                    }
                }
            }
        ]
    };

    if (vacationId) {
        where.id = { [Op.ne]: vacationId };
    }

    const vacations = await vacationRepository.findAll({
        where
    });

    if (vacations.length) {
        throw new Error(
            'Vacation duration can not be between start date and end date of the other vacation.'
        );
    }
}

async function isUserLoggedId(id, loggedUser) {
    const isAdmin = await loggedUser.isAdmin();

    if (!isAdmin && id !== loggedUser.id) {
        throw new Error('Invalid user ID.');
    }
}

async function isCorrectVacationDuration(vacationData, di) {
    const userRepository = di.get('repositories.user');
    const calculateVacationDurationHandler = di.get(
            'services.calculateVacationDurationHandler'
        ),
        { startDate, endDate, userId } = vacationData;
    const calcDuration = calculateVacationDurationHandler.handle(
        startDate,
        endDate
    );

    const { vacationDaysTaken, vacationDaysTotal } =
        await userRepository.findById(userId);

    if (vacationDaysTotal < vacationDaysTaken + calcDuration) {
        throw new Error(
            'Vacation duration can not exceed total vacation days of the user.'
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
        )
        .bail()
        .custom((userId, { req }) => isUserLoggedId(userId, req.loggedUser)),

    body(['startDate'])
        .exists()
        .withMessage('Start date is required.')
        .bail()
        .isISO8601()
        .toDate()
        .withMessage('Invalid date type.')
        .bail()
        .custom((startDate, { req }) =>
            isDateBetweenOtherVacation(
                req.body,
                req.params.id,
                req.app.get('di')
            )
        ),

    body(['endDate'])
        .exists()
        .withMessage('End date is required.')
        .bail()
        .isISO8601()
        .toDate()
        .withMessage('Invalid date type.')
        .bail()
        .custom((endDate, { req }) =>
            isSameOrAfterStartDate(req.body.startDate, endDate)
        )
        .bail()
        .custom((endDate, { req }) =>
            isDateBetweenOtherVacation(
                req.body,
                req.params.id,
                req.app.get('di')
            )
        )
        .bail()
        .custom((endDate, { req }) =>
            isCorrectVacationDuration(req.body, req.app.get('di'))
        )
];

module.exports = create;
