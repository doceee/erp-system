class VacationUpdateController {
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
        const { id } = req.params;
        const { startDate, endDate } = req.body;
        const { loggedUser } = req;
        const calcDuration = this.calculateVacationDurationHandler.handle(
            startDate,
            endDate
        );
        const { sequelize } = this.vacationRepository.db;

        const vacation = await this.vacationRepository.findById(id);

        if (!vacation) {
            return res.sendStatus(this.httpStatusCodes.NOT_FOUND);
        }

        if (vacation.isApproved) {
            return res
                .status(this.httpStatusCodes.UNPROCESSABLE_ENTITY)
                .send('You cannot update approved vacation request');
        }

        const isApproved = (await loggedUser.isAdmin()) ? true : false;

        await sequelize.transaction(async transaction => {
            await this.vacationRepository.update(
                {
                    ...req.body,
                    duration: calcDuration,
                    isApproved
                },
                {
                    transaction,
                    where: { id: vacation.id }
                }
            );

            const vacationUpdated = await this.vacationRepository.findById(
                vacation.id,
                {
                    transaction
                }
            );

            if (isApproved) {
                await this.calculateTakenVacationDaysOnUser.create(
                    vacationUpdated,
                    transaction
                );
            }

            return res.send(vacationUpdated);
        });
    }
}

module.exports = VacationUpdateController;
