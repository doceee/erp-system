<template>
    <v-app dark class="text-center">
        <h1 v-if="error.statusCode === 404">
            {{ pageNotFound }}
        </h1>
        <h1 v-else>
            {{ otherError }}
        </h1>
        <nuxt-link v-if="$auth.loggedIn" to="/dashboard"> Home page </nuxt-link>
        <nuxt-link v-else to="/"> Login page </nuxt-link>
    </v-app>
</template>

<script>
export default {
    name: 'EmptyLayout',
    layout: 'empty',
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            pageNotFound: '404 Not Found',
            otherError: 'An error occurred'
        };
    }
};
</script>

<style scoped>
h1 {
    font-size: 20px;
}
</style>
