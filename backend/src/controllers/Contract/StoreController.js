class ContractStoreController {
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
        const contractInput = {
            ...req.body,
            endDate: calcEndDate,
            duration: calcDuration,
            vacationDays,
            vacationDaysPerYear
        };
        const { sequelize } = this.contractRepository.db;

        await sequelize.transaction(async transaction => {
            const contract = await this.contractRepository.create(
                contractInput,
                {
                    transaction
                }
            );

            await this.calculateContractVacationDaysOnUser.create(
                contract,
                transaction
            );

            const newContract = await this.contractRepository.findById(
                contract.id,
                {
                    transaction
                }
            );

            return res.status(this.httpStatusCodes.CREATED).send(newContract);
        });
    }
}

module.exports = ContractStoreController;
