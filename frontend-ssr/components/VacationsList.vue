<template>
    <v-card class="d-flex mx-auto mt-6 overflow-x-auto" outlined tile>
        <v-data-table
            :headers="headers"
            :items="vacations"
            loading-text="Loading... Please wait"
            :loading="isLoading"
            class="elevation-1"
            style="width: 100%"
        >
            <template #top>
                <v-toolbar flat class="px-3">
                    <v-toolbar-title>Vacations</v-toolbar-title>
                </v-toolbar>
            </template>
            <template #[`item.action`]="{ item }">
                <v-icon
                    small
                    :disabled="item.isApproved"
                    class="mr-2"
                    @click="$emit('edit', 'isCreateEditDialogOpen', item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
                    small
                    :disabled="item.isApproved"
                    @click="$emit('delete', 'isDeleteDialogOpen', item)"
                >
                    mdi-delete
                </v-icon>
                <v-icon
                    v-if="isAdmin && !item.isApproved"
                    small
                    class="ml-2"
                    @click="$emit('submit', item)"
                >
                    mdi-thumb-up
                </v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'VacationsList',
    props: {
        vacations: {
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
    emits: ['edit', 'delete', 'submit'],
    data() {
        return {
            headers: [
                {
                    text: 'Full Name',
                    align: 'left',
                    sortable: false,
                    value: 'user.fullName'
                },
                { text: 'Start Date', value: 'startDate', sortable: false },
                { text: 'End Date', value: 'endDate', sortable: false },
                { text: 'Duration', value: 'duration', sortable: false },
                { text: 'Approved', value: 'isApproved', sortable: false },
                {
                    text: 'Actions',
                    value: 'action',
                    sortable: false
                }
            ]
        };
    },
    computed: {
        ...mapGetters({
            isAdmin: 'isAdmin'
        })
    }
};
</script>
