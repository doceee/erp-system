import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import users from './modules/users';
import contracts from './modules/contracts';
import vacations from './modules/vacations';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        auth,
        users,
        contracts,
        vacations
    }
});
