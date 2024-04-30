const { Vacation } = db;

class VacationFactory {
    static generate(vacationData) {
        const calculateVacationDurationHandler = di.get(
            'services.calculateVacationDurationHandler'
        );
        const { userId, startDate, endDate, isApproved = false } = vacationData;
        const calcDuration = calculateVacationDurationHandler.handle(
            startDate,
            endDate
        );

        return {
            userId,
            startDate,
            endDate,
            duration: calcDuration,
            isApproved
        };
    }

    static async create(vacationData) {
        const calculateTakenVacationDaysOnUser = di.get(
            'services.calculateTakenVacationDaysOnUser'
        );

        const vacation = await Vacation.create(vacationData);

        if (vacationData.isApproved) {
            await calculateTakenVacationDaysOnUser.create(vacation);
        }

        return vacation;
    }
}

module.exports = VacationFactory;
