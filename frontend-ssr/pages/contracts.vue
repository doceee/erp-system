<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-card class="mx-auto pa-6 rounded-lg">
                <v-btn
                    v-if="isAdmin"
                    class="d-block ml-auto my-2"
                    dark
                    @click="handleDialog('isCreateEditDialogOpen')"
                >
                    New Contract
                </v-btn>
                <delete-item
                    :id="selectedContract.id"
                    :is-dialog-open="isDeleteDialogOpen"
                    @close="isDeleteDialogOpen = false"
                    @submit="handleDeleteContract"
                />
                <create-or-edit-contract
                    :selected-contract="selectedContract"
                    :is-dialog-open="isCreateEditDialogOpen"
                    @close="isCreateEditDialogOpen = false"
                />
                <contracts-list
                    :contracts="contracts"
                    :is-loading="isFetchingContracts"
                    @edit="handleDialog"
                    @delete="handleDialog"
                />
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateOrEditContract from '../components/CreateOrEditContract.vue';
import ContractsList from '../components/ContractsList.vue';
import DeleteItem from '../components/DeleteItem.vue';

export default {
    name: 'ContractsPage',
    components: { CreateOrEditContract, ContractsList, DeleteItem },
    middleware: 'isAuthenticated',
    data() {
        return {
            isFetchingContracts: false,
            selectedContract: {},
            isCreateEditDialogOpen: false,
            isDeleteDialogOpen: false
        };
    },
    async fetch() {
        try {
            this.isFetchingContracts = true;

            await this.fetchContracts();
        } catch (error) {
            console.error(error);
            this.$notify({
                title: 'Error',
                type: 'error',
                text: `Failed to fetch the contracts!`
            });
        } finally {
            this.isFetchingContracts = false;
        }
    },
    computed: {
        ...mapGetters({
            isAdmin: 'isAdmin',
            contracts: 'contracts/contracts'
        })
    },
    methods: {
        ...mapActions({
            fetchContracts: 'contracts/fetchContracts',
            deleteContract: 'contracts/deleteContract'
        }),
        handleDialog(dialog, contract = {}) {
            this.selectedContract = contract;
            this[dialog] = true;
        },
        async handleDeleteContract() {
            try {
                await this.deleteContract(this.selectedContract.id);

                this.$notify({
                    title: 'Success',
                    type: 'success',
                    text: `Contract has been successfully deleted!`
                });
            } catch (error) {
                console.error(error);
                this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: `Failed to delete the contract!`
                });
            }
        }
    }
};
</script>
