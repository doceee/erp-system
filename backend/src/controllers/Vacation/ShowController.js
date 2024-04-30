class VacationShowController {
    constructor(vacationRepository, httpStatusCodes) {
        this.vacationRepository = vacationRepository;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { id } = req.params;

        const vacation = await this.vacationRepository.findById(id);

        if (!vacation) {
            return res.sendStatus(this.httpStatusCodes.NOT_FOUND);
        }

        return res.send(vacation);
    }
}

module.exports = VacationShowController;
