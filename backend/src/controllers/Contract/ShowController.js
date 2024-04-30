class ContractsShowController {
    constructor(contractRepository, httpStatusCodes) {
        this.contractRepository = contractRepository;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { id } = req.params;

        const contract = await this.contractRepository.findById(id);

        if (!contract) {
            return res.sendStatus(this.httpStatusCodes.NOT_FOUND);
        }

        return res.send(contract);
    }
}

module.exports = ContractsShowController;
