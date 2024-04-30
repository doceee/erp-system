const env = (key, defaultValue = null) => process.env[key] || defaultValue;

module.exports = {
    apiUrl: env('VUE_APP_SERVER_URL'),
    sentryDsn: env('VUE_APP_SENTRY_DSN')
};
