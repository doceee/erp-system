module.exports = {
    services: {
        'controllers.user.indexController': {
            class: 'controllers/User/IndexController',
            arguments: ['@repositories.user', '@services.cache']
        },
        'controllers.user.showController': {
            class: 'controllers/User/ShowController',
            arguments: [
                '@repositories.user',
                '%http-status-codes',
                '@services.cache'
            ]
        },
        'controllers.user.storeController': {
            class: 'controllers/User/StoreController',
            arguments: [
                '@repositories.user',
                '%http-status-codes',
                '@services.cache'
            ]
        },
        'controllers.user.updateController': {
            class: 'controllers/User/UpdateController',
            arguments: [
                '@repositories.user',
                '%http-status-codes',
                '@services.cache'
            ]
        },
        'controllers.user.deleteController': {
            class: 'controllers/User/DeleteController',
            arguments: [
                '@repositories.user',
                '%http-status-codes',
                '@services.cache'
            ]
        }
    }
};
