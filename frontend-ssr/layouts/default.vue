<template>
    <v-app dark>
        <v-navigation-drawer v-model="drawer" :clipped="clipped" dark fixed app>
            <v-list dense>
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :to="item.to"
                    router
                >
                    <v-list-item-title>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="clipped" dark fixed app>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title>ERP System</v-toolbar-title>
            <v-spacer></v-spacer>
            <h5 class="mr-3">{{ userEmail }}</h5>
            <v-btn outlined data-testid="logout" @click="onLogout">
                Logout
            </v-btn>
        </v-app-bar>
        <v-main>
            <v-container>
                <notifications position="bottom right" />
                <Nuxt />
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'DefaultLayout',
    data() {
        return {
            drawer: this.$vuetify.breakpoint.lgAndUp,
            clipped: true
        };
    },
    computed: {
        ...mapGetters({
            isAdmin: 'isAdmin'
        }),
        userEmail() {
            return this.$auth.user?.email;
        },
        items() {
            const items = [
                {
                    title: 'Dashboard',
                    to: '/dashboard',
                    show: true
                },
                {
                    title: 'Users',
                    to: '/users',
                    show: this.isAdmin
                },
                {
                    title: 'Contracts',
                    to: '/contracts',
                    show: true
                },
                {
                    title: 'Vacations',
                    to: '/vacations',
                    show: true
                },
                {
                    title: 'Account',
                    to: '/account',
                    show: true
                }
            ];

            return items.filter(item => item.show);
        }
    },
    methods: {
        async onLogout() {
            try {
                await this.$auth.logout();

                setTimeout(() => {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        text: `You are now successfully logged out!`
                    });
                }, 100);
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

<style>
.vue-notification {
    border-radius: 8px;
    font-size: 16px;
}
</style>
