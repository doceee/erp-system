module.exports = {
    services: {
        'controllers.vacation.indexController': {
            class: 'controllers/Vacation/IndexController',
            arguments: ['@repositories.vacation']
        },
        'controllers.vacation.showController': {
            class: 'controllers/Vacation/ShowController',
            arguments: ['@repositories.vacation', '%http-status-codes']
        },
        'controllers.vacation.storeController': {
            class: 'controllers/Vacation/StoreController',
            arguments: [
                '@repositories.vacation',
                '@services.calculateTakenVacationDaysOnUser',
                '@services.calculateVacationDurationHandler',
                '%http-status-codes'
            ]
        },
        'controllers.vacation.updateController': {
            class: 'controllers/Vacation/UpdateController',
            arguments: [
                '@repositories.vacation',
                '@services.calculateTakenVacationDaysOnUser',
                '@services.calculateVacationDurationHandler',
                '%http-status-codes'
            ]
        },
        'controllers.vacation.deleteController': {
            class: 'controllers/Vacation/DeleteController',
            arguments: [
                '@repositories.vacation',
                '@services.calculateTakenVacationDaysOnUser',
                '%http-status-codes'
            ]
        }
    }
};
