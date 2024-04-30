<template>
    <v-card class="d-flex mx-auto mt-6 overflow-x-auto" outlined tile>
        <v-data-table
            :headers="headers"
            :items="contracts"
            item-key="contractIdx"
            loading-text="Loading... Please wait"
            :loading="isLoading"
            class="elevation-1"
            style="width: 100%"
        >
            <template #top>
                <v-toolbar flat class="px-3">
                    <v-toolbar-title>Contracts</v-toolbar-title>
                </v-toolbar>
            </template>
            <template #[`item.action`]="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="$emit('edit', 'isCreateEditDialogOpen', item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    small
                    @click="$emit('delete', 'isDeleteDialogOpen', item)"
                >
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ContractsList',
    props: {
        contracts: {
            default: () => [],
            type: Array,
            required: true
        },
        isLoading: {
            default: true,
            type: Boolean,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            isAdmin: 'isAdmin'
        }),
        headers() {
            const headers = [
                {
                    text: 'Full Name',
                    align: 'left',
                    sortable: false,
                    value: 'user.fullName',
                    show: true
                },
                {
                    text: 'Position',
                    value: 'position',
                    sortable: false,
                    show: true
                },
                {
                    text: 'Start Date',
                    value: 'startDate',
                    sortable: false,
                    show: true
                },
                {
                    text: 'End Date',
                    value: 'endDate',
                    sortable: false,
                    show: true
                },
                {
                    text: 'Duration',
                    value: 'duration',
                    sortable: false,
                    show: true
                },
                {
                    text: 'Vacation Days Per Year',
                    value: 'vacationDaysPerYear',
                    sortable: false,
                    show: true
                },
                {
                    text: 'Vacation Days',
                    value: 'vacationDays',
                    sortable: false,
                    show: true
                },
                {
                    text: 'Actions',
                    value: 'action',
                    sortable: false,
                    show: this.isAdmin
                }
            ];

            return headers.filter(header => header.show);
        }
    }
};
</script>
