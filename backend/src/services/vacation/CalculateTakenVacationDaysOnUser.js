class CalculateTakenVacationDaysOnUser {
    async create(vacation, transaction) {
        const user = await vacation.getUser({ transaction });
        let vacationDaysTaken = vacation.duration + user.vacationDaysTaken;

        await user.update(
            {
                vacationDaysTaken
            },
            { transaction }
        );
    }
}

module.exports = CalculateTakenVacationDaysOnUser;
