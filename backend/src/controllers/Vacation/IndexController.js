class VacationIndexController {
    constructor(vacationRepository) {
        this.vacationRepository = vacationRepository;
    }

    async invoke(req, res) {
        const { loggedUser } = req;
        const where = {};

        if (!(await loggedUser.isAdmin())) {
            where.userId = loggedUser.id;
        }

        const contracts = await this.vacationRepository.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        return res.send(contracts);
    }
}

module.exports = VacationIndexController;
