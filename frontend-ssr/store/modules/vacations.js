export default {
    namespaced: true,
    state() {
        return {
            vacations: []
        };
    },
    mutations: {
        fetchVacations(state, payload) {
            state.vacations = payload;
        },
        storeVacation(state, payload) {
            state.vacations.unshift(payload);
        },
        updateVacation(state, payload) {
            const vacationIndex = state.vacations.findIndex(
                vacation => vacation.id === payload.id
            );
            state.vacations.splice(vacationIndex, 1, payload);
        },
        deleteVacation(state, payload) {
            const vacationIndex = state.vacations.findIndex(
                vacation => vacation.id === payload
            );
            state.vacations.splice(vacationIndex, 1);
        }
    },
    getters: {
        vacations(state) {
            return state.vacations;
        }
    },
    actions: {
        async fetchVacations({ commit }) {
            const { data } = await this.$axios.get(`/api/vacations`);
            commit('fetchVacations', data);
        },
        async saveVacation({ commit }, vacationData) {
            if (vacationData.id) {
                const { data } = await this.$axios.put(
                    `/api/vacations/${vacationData.id}`,
                    vacationData
                );
                commit('updateVacation', data);
            } else {
                const { data } = await this.$axios.post(
                    `/api/vacations`,
                    vacationData
                );
                commit('storeVacation', data);
            }
        },
        async deleteVacation({ commit }, vacationId) {
            await this.$axios.delete(`/api/vacations/${vacationId}`);
            commit('deleteVacation', vacationId);
        }
    }
};
