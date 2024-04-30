class ContractUpdateController {
    constructor(
        contractRepository,
        calculateContractVacationDaysOnUser,
        calculateDatesHandler,
        calculateVacationDaysHandler,
        httpStatusCodes
    ) {
        this.contractRepository = contractRepository;
        this.calculateContractVacationDaysOnUser =
            calculateContractVacationDaysOnUser;
        this.calculateDatesHandler = calculateDatesHandler;
        this.calculateVacationDaysHandler = calculateVacationDaysHandler;
        this.httpStatusCodes = httpStatusCodes;
    }

    async invoke(req, res) {
        const { id } = req.params;
        const { startDate, endDate, vacationDaysPerYear, duration } = req.body;
        const { calcEndDate, calcDuration } = this.calculateDatesHandler.handle(
            startDate,
            endDate,
            duration
        );
        const vacationDays = this.calculateVacationDaysHandler.handle(
            vacationDaysPerYear,
            calcDuration
        );

        const contract = await this.contractRepository.findById(id);

        if (!contract) {
            return res.sendStatus(this.httpStatusCodes.NOT_FOUND);
        }

        const contractUpdatedInput = {
            ...req.body,
            endDate: calcEndDate,
            duration: calcDuration,
            vacationDays,
            vacationDaysPerYear
        };

        const { sequelize } = this.contractRepository.db;

        await sequelize.transaction(async transaction => {
            await this.contractRepository.update(contractUpdatedInput, {
                transaction,
                where: { id: contract.id }
            });

            const contractUpdated = await this.contractRepository.findById(
                contract.id,
                {
                    transaction
                }
            );

            await this.calculateContractVacationDaysOnUser.update(
                contract,
                contractUpdated,
                transaction
            );

            return res.send(contractUpdated);
        });
    }
}

module.exports = ContractUpdateController;
