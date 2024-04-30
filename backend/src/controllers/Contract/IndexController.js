class ContractIndexController {
    constructor(contractRepository) {
        this.contractRepository = contractRepository;
    }

    async invoke(req, res) {
        const { loggedUser } = req;
        const where = {};

        if (!(await loggedUser.isAdmin())) {
            where.userId = loggedUser.id;
        }

        const contracts = await this.contractRepository.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        return res.send(contracts);
    }
}

module.exports = ContractIndexController;
