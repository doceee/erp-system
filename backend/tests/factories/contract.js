const { faker } = require('@faker-js/faker');
const { Contract } = db;

class ContractFactory {
    static generate(contractData) {
        const calculateDatesHandler = di.get('services.calculateDatesHandler');
        const calculateVacationDaysHandler = di.get(
            'services.calculateVacationDaysHandler'
        );
        const {
            startDate = faker.date.future(),
            userId,
            duration = 12,
            vacationDaysPerYear = 20
        } = contractData;
        const { calcEndDate, calcDuration } = calculateDatesHandler.handle(
            startDate,
            '',
            duration
        );
        const vacationDays = calculateVacationDaysHandler.handle(
            vacationDaysPerYear,
            calcDuration
        );

        return {
            userId,
            position: faker.lorem.word(6),
            startDate,
            endDate: calcEndDate,
            duration,
            vacationDays,
            vacationDaysPerYear
        };
    }

    static async create(contractData) {
        const calculateContractVacationDaysOnUser = di.get(
            'services.calculateContractVacationDaysOnUser'
        );

        const contract = await Contract.create(contractData);

        await calculateContractVacationDaysOnUser.create(contract);

        return contract;
    }
}

module.exports = ContractFactory;
