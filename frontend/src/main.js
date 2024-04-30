import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';
import Notifications from 'vue-notification';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store/store';
import DeleteItem from './components/DeleteItem.vue';
import UsersList from './components/UsersList.vue';
import ContractsList from './components/ContractsList.vue';
import VacationsList from './components/VacationsList.vue';
import { sentryDsn } from './config';

if (sentryDsn) {
    Sentry.init({
        Vue,
        dsn: sentryDsn,
        integrations: [
            new Integrations.Vue({
                Vue,
                attachProps: true
            })
        ],
        tracesSampleRate: 1.0
    });
}

Vue.use(Notifications);
Vue.config.productionTip = false;

Vue.component('DeleteItem', DeleteItem);
Vue.component('UsersList', UsersList);
Vue.component('ContractsList', ContractsList);
Vue.component('VacationsList', VacationsList);

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
}).$mount('#app');
