'use strict';
const di = require('../di');

module.exports = {
    async up() {
        const userRepository = di.get('repositories.user');
        const vacationRepository = di.get('repositories.vacation');
        const calculateTakenVacationDaysOnUser = di.get(
            'services.calculateTakenVacationDaysOnUser'
        );

        const users = await userRepository.findAll();

        for (const user of users) {
            const vacation = await vacationRepository.create({
                userId: user.id,
                startDate: '2022-06-06',
                endDate: '2022-06-10',
                duration: 5,
                isApproved: true
            });
            await calculateTakenVacationDaysOnUser.create(vacation);
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('vacations', null, {});
    }
};
