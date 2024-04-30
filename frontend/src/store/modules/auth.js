import axios from '@/plugins/axios';

export default {
    namespaced: true,
    state() {
        return {
            loggedUser: sessionStorage.getItem('loggedUser')
                ? JSON.parse(sessionStorage.getItem('loggedUser'))
                : null
        };
    },
    mutations: {
        login(state, payload) {
            sessionStorage.setItem('loggedUser', JSON.stringify(payload));
            state.loggedUser = payload;
        },
        logout(state) {
            sessionStorage.removeItem('loggedUser');
            state.loggedUser = null;
        }
    },
    actions: {
        async login({ commit }, formData) {
            const { data } = await axios.post(`/api/auth/login`, formData);
            commit('login', data);
        },
        async logout({ commit }) {
            await axios.post(`/api/auth/logout`);
            commit('logout');
        }
    },
    getters: {
        loggedUser(state) {
            return state.loggedUser;
        },
        isAuthenticated(state) {
            return !!state.loggedUser;
        },
        isAdmin(state) {
            return (
                (state.loggedUser &&
                    state.loggedUser.roles.some(
                        role => role.name === 'admin'
                    )) ||
                false
            );
        },
        isUser(state) {
            return (
                (state.loggedUser &&
                    state.loggedUser.roles.some(
                        role => role.name === 'user'
                    )) ||
                false
            );
        }
    }
};
