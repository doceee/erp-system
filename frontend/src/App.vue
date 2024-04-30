<template>
    <v-app>
        <component :is="layout" />
        <v-main>
            <notifications position="bottom right" />
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
import DefaultLayout from './components/layout/DefaultLayout.vue';
import LoggedLayout from './components/layout/LoggedLayout.vue';

export default {
    name: 'App',
    components: {
        LoggedLayout,
        DefaultLayout
    },
    computed: {
        layout() {
            const layout = this.$route.meta.layout || 'Default';

            return `${layout}Layout`;
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
