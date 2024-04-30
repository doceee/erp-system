class VacationDeleteController {
    constructor(
        vacationRepository,
        calculateTakenVacationDaysOnUser,
        httpStatusCodes
    ) {
        this.vacationRepository = vacationRepository;
        this.calculateTakenVacationDaysOnUser =
            calculateTakenVacationDaysOnUser;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { id } = req.params;

        const vacation = await this.vacationRepository.findById(id);

        if (!vacation || vacation.isApproved) {
            return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
        }

        await vacation.destroy();

        return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
    }
}

module.exports = VacationDeleteController;
