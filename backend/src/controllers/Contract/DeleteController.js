class ContractDeleteController {
    constructor(
        contractRepository,
        calculateContractVacationDaysOnUser,
        httpStatusCodes
    ) {
        this.contractRepository = contractRepository;
        this.calculateContractVacationDaysOnUser =
            calculateContractVacationDaysOnUser;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { id } = req.params;

        const contract = await this.contractRepository.findById(id);

        if (!contract) {
            return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
        }

        const { sequelize } = this.contractRepository.db;

        await sequelize.transaction(async transaction => {
            await contract.destroy({
                transaction
            });

            await this.calculateContractVacationDaysOnUser.delete(
                contract,
                transaction
            );

            return res.sendStatus(this.httpStatusCodes.NO_CONTENT);
        });
    }
}

module.exports = ContractDeleteController;
