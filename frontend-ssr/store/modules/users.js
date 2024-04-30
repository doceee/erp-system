export default {
    namespaced: true,
    state() {
        return {
            limit: 0,
            count: 0,
            pages: 0,
            page: 0,
            secondPage: [],
            rows: []
        };
    },
    mutations: {
        fetchUsers(state, payload) {
            Object.assign(state, { ...payload });
        },
        storeUser(state, payload) {
            state.rows.unshift(payload);
            state.count++;

            if (
                state.secondPage.length === 1 ||
                state.secondPage.length % state.limit === 0
            ) {
                state.pages++;
            }

            if (state.rows.length > state.limit) {
                state.secondPage.unshift(state.rows[state.rows.length - 1]);
                state.rows.splice(state.rows.length - 1, 1);
            }
        },
        updateUser(state, payload) {
            const userIndex = state.rows.findIndex(
                user => user.id === payload.id
            );
            state.rows.splice(userIndex, 1, payload);
        },
        deleteUser(state, payload) {
            const userIndex = state.rows.findIndex(user => user.id === payload);
            state.rows.splice(userIndex, 1);
            state.count--;

            if (state.secondPage.length) {
                state.rows.push(state.secondPage[0]);
                state.secondPage.splice(0, 1);
            }
        }
    },
    getters: {
        users(state) {
            return state.rows;
        },
        page(state) {
            return state.page;
        },
        pages(state) {
            return state.pages;
        },
        limit(state) {
            return state.limit;
        }
    },
    actions: {
        async fetchUsers({ commit }, params) {
            const { data } = await this.$axios.get(`/api/users`, { params });
            commit('fetchUsers', data);
        },
        async searchUsers(context, params) {
            const {
                data: { rows }
            } = await this.$axios.get(`/api/users`, { params });

            return rows;
        },
        async saveUser({ dispatch, commit, state }, userData) {
            if (userData.id) {
                const { data } = await this.$axios.put(
                    `/api/users/${userData.id}`,
                    userData
                );
                commit('updateUser', data);
            } else {
                const { page } = state;

                const { data } = await this.$axios.post(`/api/users`, userData);
                commit('storeUser', data);

                if (state.secondPage.length > state.limit) {
                    dispatch('fetchUsers', { page });
                }
            }
        },
        async deleteUser({ dispatch, commit, state }, userId) {
            const { page } = state;

            await this.$axios.delete(`/api/users/${userId}`);
            commit('deleteUser', userId);

            if (page === state.pages && state.rows.length === 0) {
                const computedPage = page - 1;
                dispatch('fetchUsers', { page: computedPage });
                this.$router.push(`/users/${computedPage}`);
            } else if (
                (state.secondPage.length === 0 && page !== 1) ||
                state.count % state.limit === 0
            ) {
                dispatch('fetchUsers', { page });
            }
        }
    }
};
