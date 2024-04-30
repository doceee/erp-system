const config = require('../config');

module.exports = {
    parameters: {
        config,
        'config.db': config.db,
        'config.redisCache': config.redisCache,
        'config.redisSession': config.redisSession,
        'config.cache': config.cache
    },
    services: {
        'services.nodemailer': {
            arguments: ['%config%', '%nodemailer'],
            factory: {
                class: 'services/Factories/MailerFactory',
                method: 'create'
            }
        },
        'services.passwordResetTokenGeneratorHandler': {
            class: 'services/PasswordResetTokenGeneratorHandler'
        },
        'services.calculateVacationDurationHandler': {
            class: 'services/vacation/CalculateVacationDurationHandler'
        },
        'services.calculateTakenVacationDaysOnUser': {
            class: 'services/vacation/CalculateTakenVacationDaysOnUser'
        },
        'services.calculateContractVacationDaysOnUser': {
            class: 'services/contract/CalculateContractVacationDaysOnUser'
        },
        'services.calculateDatesHandler': {
            class: 'services/contract/CalculateDatesHandler'
        },
        'services.calculateVacationDaysHandler': {
            class: 'services/contract/CalculateVacationDaysHandler'
        },
        'services.redisSessionClient': {
            arguments: ['%redis', '%config.redisSession%'],
            factory: {
                class: 'services/Factories/RedisClientFactory',
                method: 'create'
            }
        },
        'services.redisCacheClient': {
            arguments: ['%redis', '%config.redisCache%'],
            factory: {
                class: 'services/Factories/RedisClientFactory',
                method: 'create'
            }
        },
        'services.cache': {
            class: 'services/Cache',
            arguments: ['@services.redisCacheClient', '%config.cache%']
        },
        'services.redisSession': {
            arguments: ['@services.redisSessionClient'],
            factory: {
                class: 'services/Factories/RedisStoreFactory',
                method: 'create'
            }
        },
        'services.sequelize': {
            arguments: ['%sequelize', '%config.db%'],
            factory: {
                class: 'services/Factories/SequelizeFactory',
                method: 'create'
            }
        }
    }
};
