<template>
    <v-card class="mx-auto pa-6 rounded-lg">
        <div class="d-flex align-start justify-space-between mb-5 px-5 py-1">
            <h2> Dashboard </h2>
        </div>
        <component :is="checkDashboard" />
    </v-card>
</template>

<script>
import { mapGetters } from 'vuex';
import AdminDashboard from '../components/AdminDashboard.vue';
import UserDashboard from '../components/UserDashboard.vue';

export default {
    name: 'TheDashboard',
    components: {
        AdminDashboard,
        UserDashboard
    },
    computed: {
        ...mapGetters({
            isAdmin: 'auth/isAdmin'
        }),
        checkDashboard() {
            const role = this.isAdmin ? 'Admin' : 'User';

            return `${role}Dashboard`;
        }
    }
};
</script>
