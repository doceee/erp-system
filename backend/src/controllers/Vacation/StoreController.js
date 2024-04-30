class VacationStoreController {
    constructor(
        vacationRepository,
        calculateTakenVacationDaysOnUser,
        calculateVacationDurationHandler,
        httpStatusCodes
    ) {
        this.vacationRepository = vacationRepository;
        this.calculateTakenVacationDaysOnUser =
            calculateTakenVacationDaysOnUser;
        this.calculateVacationDurationHandler =
            calculateVacationDurationHandler;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { startDate, endDate } = req.body;
        const { loggedUser } = req;
        const calcDuration = this.calculateVacationDurationHandler.handle(
            startDate,
            endDate
        );
        const { sequelize } = this.vacationRepository.db;

        const isApproved = (await loggedUser.isAdmin()) ? true : false;

        await sequelize.transaction(async transaction => {
            const vacation = await this.vacationRepository.create(
                {
                    ...req.body,
                    duration: calcDuration,
                    isApproved
                },
                {
                    transaction
                }
            );

            if (isApproved) {
                await this.calculateTakenVacationDaysOnUser.create(
                    vacation,
                    transaction
                );
            }

            const newVacation = await this.vacationRepository.findById(
                vacation.id,
                {
                    transaction
                }
            );

            return res.status(this.httpStatusCodes.CREATED).send(newVacation);
        });
    }
}

module.exports = VacationStoreController;
