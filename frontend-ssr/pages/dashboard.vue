<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-card class="mx-auto pa-6 rounded-lg">
                <v-card-title> Dashboard </v-card-title>
                <component :is="checkDashboard" />
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminDashboard from '../components/AdminDashboard.vue';
import UserDashboard from '../components/UserDashboard.vue';

export default {
    name: 'DashboardPage',
    components: {
        AdminDashboard,
        UserDashboard
    },
    middleware: 'isAuthenticated',
    computed: {
        ...mapGetters({
            page: 'users/page',
            isAdmin: 'isAdmin'
        }),
        checkDashboard() {
            const role = this.isAdmin ? 'Admin' : 'User';

            return `${role}Dashboard`;
        }
    }
};
</script>
