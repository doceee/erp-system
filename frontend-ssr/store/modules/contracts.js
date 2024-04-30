export default {
    namespaced: true,
    state() {
        return {
            contracts: []
        };
    },
    mutations: {
        fetchContracts(state, payload) {
            state.contracts = payload;
        },
        storeContract(state, payload) {
            state.contracts.unshift(payload);
        },
        updateContract(state, payload) {
            const contractIndex = state.contracts.findIndex(
                contract => contract.id === payload.id
            );
            state.contracts.splice(contractIndex, 1, payload);
        },
        deleteContract(state, payload) {
            const contractIndex = state.contracts.findIndex(
                contract => contract.id === payload
            );
            state.contracts.splice(contractIndex, 1);
        }
    },
    getters: {
        contracts(state) {
            return state.contracts;
        }
    },
    actions: {
        async fetchContracts({ commit }) {
            const { data } = await this.$axios.get(`/api/contracts`);
            commit('fetchContracts', data);
        },
        async saveContract({ commit }, contractData) {
            if (contractData.id) {
                const { data } = await this.$axios.put(
                    `/api/contracts/${contractData.id}`,
                    contractData
                );
                commit('updateContract', data);
            } else {
                const { data } = await this.$axios.post(
                    `/api/contracts`,
                    contractData
                );
                commit('storeContract', data);
            }
        },
        async deleteContract({ commit }, contractId) {
            await this.$axios.delete(`/api/contracts/${contractId}`);
            commit('deleteContract', contractId);
        }
    }
};
