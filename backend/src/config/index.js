require('dotenv').config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const env = (key, defaultValue = null) => process.env[key] || defaultValue;
const isEnabled = key => env(key) && env(key) === 'true';

if (!['production', 'development', 'test'].includes(env('NODE_ENV'))) {
    console.error('NODE_ENV has wrong option');
    process.exit();
}

module.exports = {
    app: {
        env: env('NODE_ENV'),
        url: env('APP_URL', 'http://localhost:3001'),
        port: parseInt(env('PORT', 3001)),
        secret: env('APP_SESSION_SECRET'),
        frontendUrl: env('APP_FRONTEND_URL')
    },
    db: {
        url:
            env('DATABASE_DIALECT', 'mysql') +
            '://' +
            env('DATABASE_USERNAME', 'guest') +
            ':' +
            env('DATABASE_PASSWORD', 'guest') +
            '@' +
            env('DATABASE_HOST', 'localhost') +
            ':' +
            env('DATABASE_PORT', 3306) +
            '/' +
            env('DATABASE_NAME', 'db'),
        host: env('DATABASE_HOST', 'localhost'),
        name: env('DATABASE_NAME'),
        username: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        dialect: env('DATABASE_DIALECT', 'mysql'),
        port: parseInt(env('DATABASE_PORT', 3306)),
        logging: isEnabled('SEQUELIZE_LOGGING') ? console.log : false,
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false
        }
    },
    redisCache: {
        host: env('CACHE_REDIS_HOST'),
        port: env('CACHE_REDIS_PORT'),
        pass: env('CACHE_REDIS_PASS') || undefined,
        password: env('CACHE_REDIS_PASS') || undefined,
        ttl: env('CACHE_REDIS_TTL')
    },
    redisSession: {
        host: env('SESSION_REDIS_HOST'),
        port: env('SESSION_REDIS_PORT'),
        pass: env('SESSION_REDIS_PASS') || undefined,
        password: env('SESSION_REDIS_PASS') || undefined,
        ttl: env('SESSION_REDIS_TTL')
    },
    cache: {
        enable: isEnabled('CACHE_ENABLE'),
        keyExpiresInMinutes: parseInt(env('CACHE_KEY_EXPIRES_IN_MINUTES'))
    },
    mail: {
        sendgridApiKey: env('MAIL_SENDGRID_API_KEY'),
        host: env('MAIL_HOST'),
        port: env('MAIL_PORT'),
        secure: isEnabled(env('MAIL_SECURE')),
        auth: {
            user: env('MAIL_AUTH_USER'),
            pass: env('MAIL_AUTH_PASS')
        }
    },
    sentryDsn: env('SENTRY_DSN'),
    noReplyAddress: env('NO_REPLY_ADDRESS')
};
