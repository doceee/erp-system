<template>
    <div>
        <div class="d-flex justify-end py-2">
            <v-btn
                dark
                data-testid="new-user"
                @click="handleDialog('isCreateEditDialogOpen')"
            >
                New User
            </v-btn>
        </div>
        <delete-item
            :id="selectedUser.id"
            :is-dialog-open="isDeleteDialogOpen"
            @close="isDeleteDialogOpen = false"
            @submit="handleDeleteUser"
        />
        <create-or-edit-user
            :selected-user="selectedUser"
            :is-dialog-open="isCreateEditDialogOpen"
            @close="isCreateEditDialogOpen = false"
        />
        <users-list
            :users="users"
            :is-loading="isFetchingUsers"
            :page="currentPage"
            @edit="handleDialog"
            @delete="handleDialog"
        />
        <v-pagination
            v-if="pages > 1"
            v-model="currentPage"
            :length="pages"
            color="grey darken-3"
            circle
            @input="onPageChange"
        ></v-pagination>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateOrEditUser from './CreateOrEditUser.vue';

export default {
    name: 'AdminDashboard',
    components: { CreateOrEditUser },
    data() {
        return {
            isFetchingUsers: false,
            selectedUser: {},
            isCreateEditDialogOpen: false,
            isDeleteDialogOpen: false
        };
    },
    async fetch() {
        await this.getUsers();
    },
    computed: {
        ...mapGetters({
            users: 'users/users',
            page: 'users/page',
            pages: 'users/pages'
        }),
        currentPage: {
            get() {
                return this.page;
            },
            set(page) {
                return page;
            }
        }
    },
    methods: {
        ...mapActions({
            fetchUsers: 'users/fetchUsers',
            deleteUser: 'users/deleteUser'
        }),
        async onPageChange(page) {
            await this.getUsers({ page });
        },
        handleDialog(dialog, user = {}) {
            this.selectedUser = user;
            this[dialog] = true;
        },
        async getUsers(params) {
            try {
                this.isFetchingUsers = true;

                await this.fetchUsers(params);
            } catch (error) {
                console.error(error);
                this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: `Failed to fetch the users!`
                });
            } finally {
                this.isFetchingUsers = false;
            }
        },
        async handleDeleteUser() {
            try {
                await this.deleteUser(this.selectedUser.id);

                this.$notify({
                    title: 'Success',
                    type: 'success',
                    text: `User has been successfully deleted!`
                });
            } catch (error) {
                console.error(error);
                this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: `Failed to delete the user!`
                });
            }
        }
    }
};
</script>
