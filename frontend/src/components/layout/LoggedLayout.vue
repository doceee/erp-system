<template>
    <nav class="overflow-hidden">
        <v-app-bar color="grey darken-3 d-block" clipped-left app dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>ERP System</v-toolbar-title>
            <v-spacer></v-spacer>
            <h5 class="mr-3">
                {{ userEmail }}
            </h5>
            <v-btn data-testid="logout" @click="onLogout"> Logout </v-btn>
        </v-app-bar>
        <v-navigation-drawer v-model="drawer" clipped app dark>
            <v-list nav dense>
                <v-list>
                    <v-list-item to="/dashboard">
                        <v-list-item-title> Dashboard </v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/contracts">
                        <v-list-item-title> Contracts </v-list-item-title>
                    </v-list-item>
                    <v-list-item to="/vacations">
                        <v-list-item-title> Vacations </v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-list>
        </v-navigation-drawer>
    </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: 'LoggedLayout',
    data() {
        return {
            drawer: this.$vuetify.breakpoint.lgAndUp
        };
    },
    computed: {
        ...mapGetters({
            loggedUser: 'auth/loggedUser'
        }),
        userEmail() {
            return this.loggedUser && this.loggedUser.email;
        }
    },
    methods: {
        ...mapActions({ logout: 'auth/logout' }),
        async onLogout() {
            try {
                await this.logout();

                this.$router.replace('/login').then(() => {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        text: `You are now successfully logged out!`
                    });
                });
            } catch (error) {
                console.error(error);
                this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: `Failed to log out!`
                });
            }
        }
    }
};
</script>
