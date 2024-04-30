<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <v-card width="400" class="mt-8 mx-auto pa-6 rounded-lg">
                <div class="text-h6 mb-3">Reset Password</div>
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
                    <v-btn
                        class="grey mt-5 d-block mx-auto darken-3 text-center white--text"
                        type="submit"
                        data-testid="submit"
                        :disabled="$v.$invalid || isLoading"
                    >
                        {{ isLoading ? 'Loading' : 'Submit' }}
                    </v-btn>
                </form>
                <div class="text-right black--text mt-2">
                    <nuxt-link to="/"> Login </nuxt-link>
                </div>
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import emailValidationMixin from '../../validators/requestResetPassword.mixin';

export default {
    name: 'ForgotPaswordPage',
    mixins: [emailValidationMixin],
    layout: 'guest',
    middleware: 'notAuthenticated',
    data() {
        const defaultFormData = {
            email: ''
        };

        return {
            formData: { ...defaultFormData },
            defaultFormData,
            isLoading: false
        };
    },
    methods: {
        ...mapActions({
            requestResetPassword: 'authentication/requestResetPassword'
        }),
        async submit() {
            try {
                this.isLoading = true;

                await this.requestResetPassword(this.formData);

                this.$router.push('/', () => {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        text: 'Check your mailbox for further instructions.'
                    });
                });
            } catch (error) {
                console.error(error);

                this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: 'Failed to reset the password.'
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>
