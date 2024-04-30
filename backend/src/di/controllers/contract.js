module.exports = {
    services: {
        'controllers.contract.indexController': {
            class: 'controllers/Contract/IndexController',
            arguments: ['@repositories.contract']
        },
        'controllers.contract.showController': {
            class: 'controllers/Contract/ShowController',
            arguments: ['@repositories.contract', '%http-status-codes']
        },
        'controllers.contract.storeController': {
            class: 'controllers/Contract/StoreController',
            arguments: [
                '@repositories.contract',
                '@services.calculateContractVacationDaysOnUser',
                '@services.calculateDatesHandler',
                '@services.calculateVacationDaysHandler',
                '%http-status-codes'
            ]
        },
        'controllers.contract.updateController': {
            class: 'controllers/Contract/UpdateController',
            arguments: [
                '@repositories.contract',
                '@services.calculateContractVacationDaysOnUser',
                '@services.calculateDatesHandler',
                '@services.calculateVacationDaysHandler',
                '%http-status-codes'
            ]
        },
        'controllers.contract.deleteController': {
            class: 'controllers/Contract/DeleteController',
            arguments: [
                '@repositories.contract',
                '@services.calculateContractVacationDaysOnUser',
                '%http-status-codes'
            ]
        }
    }
};
