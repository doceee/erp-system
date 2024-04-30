<template>
    <v-card width="400" class="mt-8 mx-auto pa-6 rounded-lg">
        <form @submit.prevent="submit($event)">
            <v-text-field
                v-model.trim="formData.email"
                name="email"
                :error-messages="emailErrors"
                label="E-mail"
                type="email"
                required
                @blur="$v.formData.email.$touch()"
            ></v-text-field>
            <v-text-field
                v-model.trim="formData.password"
                name="password"
                :error-messages="passwordErrors"
                label="Password"
                type="password"
                required
                @blur="$v.formData.password.$touch()"
            ></v-text-field>
            <v-btn
                class="grey mt-5 d-block mx-auto darken-3 text-center white--text"
                type="submit"
                data-testid="submit"
                :disabled="$v.$invalid || isLoading"
            >
                {{ isLoading ? 'Loading' : 'Login' }}
            </v-btn>
        </form>
    </v-card>
</template>

<script>
import loginValidationMixin from '../validators/login.mixin';
import { mapActions, mapGetters } from 'vuex';

export default {
    mixins: [loginValidationMixin],
    data() {
        const defaultFormData = {
            email: '',
            password: ''
        };

        return {
            formData: { ...defaultFormData },
            defaultFormData,
            isLoading: false
        };
    },
    computed: {
        ...mapGetters({
            isUser: 'auth/isUser'
        })
    },
    methods: {
        ...mapActions({ login: 'auth/login' }),
        async submit() {
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                this.isLoading = true;

                await this.login(this.formData);

                this.$router.replace('/dashboard').then(() => {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        text: 'You have successfully logged in!'
                    });
                });
            } catch (error) {
                console.error(error);
                this.parseServerErrors(error);

                if (error.response.status === 401) {
                    this.$notify({
                        title: 'Error',
                        type: 'error',
                        text: 'Invalid e-mail or password'
                    });
                }
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>
