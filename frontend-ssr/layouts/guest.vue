<template>
    <v-app dark>
        <v-app-bar dark fixed app>
            <v-toolbar-title>ERP System</v-toolbar-title>
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
export default {
    name: 'GuestLayout',
    layout: 'guest'
};
</script>

<style>
.vue-notification {
    border-radius: 8px;
    font-size: 16px;
}
</style>
