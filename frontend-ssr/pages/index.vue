<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <v-card width="400" class="mt-8 mx-auto pa-6 rounded-lg">
                <div class="text-h6 mb-3">Login</div>
                <form @submit.prevent="submit($event)">
                    <v-text-field
                        v-model.trim="formData.email"
                        name="email"
                        :error-messages="emailErrors"
                        label="E-mail"
                        type="email"
                        required
                        @blur="$v.formData.email.$touch()"
                    />
                    <v-text-field
                        v-model.trim="formData.password"
                        name="password"
                        :error-messages="passwordErrors"
                        label="Password"
                        type="password"
                        required
                        @blur="$v.formData.password.$touch()"
                    />
                    <v-btn
                        class="grey mt-5 d-block mx-auto darken-3 text-center white--text"
                        type="submit"
                        data-testid="submit"
                        :disabled="$v.$invalid || isLoading"
                    >
                        {{ isLoading ? 'Loading' : 'Login' }}
                    </v-btn>
                </form>
                <div class="text-right black--text mt-2">
                    <nuxt-link to="/reset-password">
                        Forgot password?
                    </nuxt-link>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import loginValidationMixin from '../validators/login.mixin';

export default {
    name: 'IndexPage',
    mixins: [loginValidationMixin],
    layout: 'guest',
    middleware: 'notAuthenticated',
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
    methods: {
        async submit() {
            try {
                this.isLoading = true;

                const { data } = await this.$auth.loginWith('cookie', {
                    data: this.formData
                });

                this.$auth.setUser(data);
                setTimeout(() => {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        text: 'You have successfully logged in!'
                    });
                }, 100);
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
