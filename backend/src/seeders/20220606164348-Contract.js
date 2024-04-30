'use strict';
const di = require('../di');
const { faker } = require('@faker-js/faker');

module.exports = {
    async up() {
        const userRepository = di.get('repositories.user');
        const contractRepository = di.get('repositories.contract');
        const calculateContractVacationDaysOnUser = di.get(
            'services.calculateContractVacationDaysOnUser'
        );

        const users = await userRepository.findAll();

        for (const user of users) {
            const contract = await contractRepository.create({
                userId: user.id,
                startDate: '2022-01-01',
                endDate: '2022-12-31',
                duration: 12,
                position: faker.lorem.word(6),
                vacationDays: 20,
                vacationDaysPerYear: 20
            });
            await calculateContractVacationDaysOnUser.create(contract);
        }
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('contracts', null, {});
    }
};
