<template>
    <div>
        <v-card class="d-flex mx-auto mt-6 overflow-x-auto" outlined tile>
            <v-data-table
                :headers="headers"
                :items="users"
                loading-text="Loading... Please wait"
                :loading="isLoading"
                class="elevation-1"
                style="width: 100%"
                :items-per-page="limit"
                hide-default-footer
            >
                <template #top>
                    <v-toolbar flat class="px-3">
                        <v-toolbar-title>Users</v-toolbar-title>
                    </v-toolbar>
                </template>
                <template #[`item.action`]="{ item }">
                    <v-icon
                        small
                        data-testid="user-edit"
                        class="mr-2"
                        @click="$emit('edit', 'isCreateEditDialogOpen', item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        small
                        data-testid="user-delete"
                        @click="$emit('delete', 'isDeleteDialogOpen', item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'UsersList',
    props: {
        users: {
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
    emits: ['edit', 'delete'],
    data() {
        return {
            headers: [
                {
                    text: 'Full Name',
                    align: 'left',
                    value: 'fullName',
                    sortable: false
                },
                { text: 'Birthday', value: 'birthday', sortable: false },
                { text: 'Email', value: 'email', sortable: false },
                {
                    text: 'Vacation Days Total',
                    value: 'vacationDaysTotal',
                    sortable: false
                },
                {
                    text: 'Vacation Days Taken',
                    value: 'vacationDaysTaken',
                    sortable: false
                },
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
            limit: 'users/limit'
        })
    }
};
</script>
