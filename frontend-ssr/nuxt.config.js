export default {
    head: {
        title: 'erp',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            { hid: 'description', name: 'description', content: '' },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    css: [],

    plugins: [
        { src: '~/plugins/vue-notification-client.js', mode: 'client' },
        { src: '~/plugins/vue-notification-server.js', mode: 'server' }
    ],

    components: true,

    buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],

    modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', 'cookie-universal-nuxt'],

    auth: {
        cookie: {
            options: {
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 15
            }
        },
        watchLoggedIn: true,
        rewriteRedirects: false,
        redirect: {
            login: '/',
            logout: '/',
            home: '/dashboard',
            callback: '/'
        },
        strategies: {
            cookie: {
                user: {
                    property: false,
                    autoFetch: false
                },
                endpoints: {
                    login: { url: 'api/auth/login', method: 'post' },
                    logout: { url: 'api/auth/logout', method: 'post' },
                    user: { url: 'api/auth/me', method: 'get' }
                }
            }
        }
    },

    axios: {
        baseURL: process.env.VUE_APP_SERVER_URL || 'http://localhost:3000',
        credentials: true
    },

    build: {},

    server: {
        port: 8080
    }
};
