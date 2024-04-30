<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-card class="mx-auto pa-6 rounded-lg">
                <v-btn
                    dark
                    class="d-block ml-auto my-2"
                    data-testid="new-user"
                    @click="handleDialog('isCreateEditDialogOpen')"
                >
                    New User
                </v-btn>
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
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CreateOrEditUser from '../../components/CreateOrEditUser.vue';
import UsersList from '../../components/UsersList.vue';
import DeleteItem from '../../components/DeleteItem.vue';

export default {
    name: 'TheUsers',
    components: { CreateOrEditUser, UsersList, DeleteItem },
    middleware: ['isAuthenticated', 'isAdmin'],
    data() {
        return {
            isFetchingUsers: false,
            selectedUser: {},
            isCreateEditDialogOpen: false,
            isDeleteDialogOpen: false
        };
    },
    async fetch() {
        await this.getUsers({ page: this.currentPage });
    },
    computed: {
        ...mapGetters({
            users: 'users/users',
            pages: 'users/pages'
        }),
        currentPage: {
            get() {
                return this.validatePage(this.$route.params.page);
            },
            set(page) {
                return page;
            }
        }
    },
    watch: {
        watch: {
            '$route.params.page': '$fetch'
        }
    },
    methods: {
        ...mapActions({
            fetchUsers: 'users/fetchUsers',
            deleteUser: 'users/deleteUser'
        }),
        onPageChange(page) {
            const newPage = this.validatePage(page);
            let usersPath = '/users';

            if (newPage !== 1) {
                usersPath = usersPath + '/' + newPage;
            }

            this.$router.push(usersPath);
        },
        validatePage(number) {
            const page = parseInt(number, 10) || 1;

            if (isNaN(page) || page > this.pages || page < 1) {
                this.$router.push('/users');
            }

            return page;
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
