<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-card class="mx-auto pa-6 rounded-lg">
                <v-btn
                    class="d-block ml-auto my-2"
                    dark
                    @click="handleDialog('isCreateEditDialogOpen')"
                >
                    New Vacation
                </v-btn>
                <delete-item
                    :id="selectedVacation.id"
                    :is-dialog-open="isDeleteDialogOpen"
                    @close="isDeleteDialogOpen = false"
                    @submit="handleDeleteVacation"
                />
                <create-or-edit-vacation
                    :selected-vacation="selectedVacation"
                    :is-dialog-open="isCreateEditDialogOpen"
                    @close="isCreateEditDialogOpen = false"
                />
                <vacations-list
                    :vacations="vacations"
                    :is-loading="isFetchingVacations"
                    @edit="handleDialog"
                    @delete="handleDialog"
                    @submit="handleApproveVacationRequest"
                />
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateOrEditVacation from '../components/CreateOrEditVacation.vue';

export default {
    name: 'VacationsPage',
    components: { CreateOrEditVacation },
    middleware: 'isAuthenticated',
    data() {
        return {
            isFetchingVacations: false,
            selectedVacation: {},
            isCreateEditDialogOpen: false,
            isDeleteDialogOpen: false
        };
    },
    async fetch() {
        try {
            this.isFetchingVacations = true;

            await this.fetchVacations();
        } catch (error) {
            console.error(error);
            this.$notify({
                title: 'Error',
                type: 'error',
                text: `Failed to fetch the vacations!`
            });
        } finally {
            this.isFetchingVacations = false;
        }
    },
    computed: {
        ...mapGetters({
            vacations: 'vacations/vacations'
        })
    },
    methods: {
        ...mapActions({
            fetchVacations: 'vacations/fetchVacations',
            deleteVacation: 'vacations/deleteVacation',
            saveVacation: 'vacations/saveVacation'
        }),
        handleDialog(dialog, vacation = {}) {
            this.selectedVacation = vacation;
            this[dialog] = true;
        },
        async handleApproveVacationRequest(vacation) {
            try {
                await this.saveVacation(vacation);

                this.$notify({
                    title: 'Success',
                    type: 'success',
                    text: `Vacation request has been successfully saved!`
                });
            } catch (error) {
                console.error(error);
                this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: `Failed to save the vacation request!`
                });
            }
        },
        async handleDeleteVacation() {
            try {
                await this.deleteVacation(this.selectedVacation.id);

                this.$notify({
                    title: 'Success',
                    type: 'success',
                    text: `Vacation has been successfully deleted!`
                });
            } catch (error) {
                console.error(error);
                this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: `Failed to delete the vacation!`
                });
            }
        }
    }
};
</script>
