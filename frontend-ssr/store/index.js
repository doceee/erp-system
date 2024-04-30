import Vuex from 'vuex';
import users from './modules/users.js';
import contracts from './modules/contracts.js';
import vacations from './modules/vacations.js';
import authentication from './modules/authentication.js';

const createStore = () => {
    return new Vuex.Store({
        modules: {
            users,
            contracts,
            vacations,
            authentication
        },
        getters: {
            isAdmin(state) {
                return (
                    state.auth.user?.roles?.some(
                        role => role.name === 'admin'
                    ) || false
                );
            }
        }
    });
};

export default createStore;
