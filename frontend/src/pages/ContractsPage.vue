<template>
    <v-card class="mx-auto pa-6 rounded-lg">
        <div v-if="isAdmin" class="d-flex justify-end py-2">
            <v-btn dark @click="handleDialog('isCreateEditDialogOpen')">
                New Contract
            </v-btn>
        </div>
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
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateOrEditContract from '../components/CreateOrEditContract.vue';

export default {
    name: 'ContractsPage',
    components: { CreateOrEditContract },
    data() {
        return {
            isFetchingContracts: false,
            selectedContract: {},
            isCreateEditDialogOpen: false,
            isDeleteDialogOpen: false
        };
    },
    computed: {
        ...mapGetters({
            isAdmin: 'auth/isAdmin',
            contracts: 'contracts/contracts'
        })
    },
    async created() {
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
