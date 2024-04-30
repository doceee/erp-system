class CalculateContractVacationDaysOnUser {
    async create(contract, transaction) {
        const user = await contract.getUser({ transaction });

        let vacationDaysTotal = contract.vacationDays + user.vacationDaysTotal;

        await user.update(
            {
                vacationDaysTotal
            },
            { transaction }
        );
    }

    async delete(contract, transaction) {
        const user = await contract.getUser({ transaction });

        let vacationDaysTotal = user.vacationDaysTotal - contract.vacationDays;

        if (vacationDaysTotal < 0) {
            vacationDaysTotal = 0;
        }

        await user.update(
            {
                vacationDaysTotal
            },
            { transaction }
        );
    }

    async update(contract, contractUpdated, transaction) {
        await this.delete(contract, transaction);
        await this.create(contractUpdated, transaction);
    }
}

module.exports = CalculateContractVacationDaysOnUser;
