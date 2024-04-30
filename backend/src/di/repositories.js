module.exports = {
    services: {
        'repositories.user': {
            class: 'repositories/UserRepository',
            arguments: ['@services.sequelize']
        },
        'repositories.contract': {
            class: 'repositories/ContractRepository',
            arguments: ['@services.sequelize']
        },
        'repositories.vacation': {
            class: 'repositories/VacationRepository',
            arguments: ['@services.sequelize']
        }
    }
};
