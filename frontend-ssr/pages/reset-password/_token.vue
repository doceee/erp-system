<template>
    <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="6">
            <v-card width="400" class="mt-8 mx-auto pa-6 rounded-lg">
                <div class="text-h6 mb-3">Reset Password</div>
                <form @submit.prevent="submit($event)">
                    <v-text-field
                        v-model.trim="formData.password"
                        name="password"
                        :error-messages="passwordErrors"
                        label="Password"
                        type="password"
                        required
                        @blur="$v.formData.password.$touch()"
                    />
                    <v-text-field
                        v-model.trim="formData.confirmPassword"
                        name="confirmPassword"
                        :error-messages="confirmPasswordErrors"
                        label="Confirm Password"
                        type="password"
                        required
                        @blur="$v.formData.confirmPassword.$touch()"
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
            </v-card>
        </v-col>
    </v-row>
</template>

<script>
import { mapActions } from 'vuex';
import resetPasswordValidationMixin from '../../validators/resetPassword.mixin';

export default {
    name: 'ResetPaswordPage',
    mixins: [resetPasswordValidationMixin],
    layout: 'guest',
    middleware: 'notAuthenticated',
    data() {
        const defaultFormData = {
            password: '',
            confirmPassword: ''
        };

        return {
            formData: { ...defaultFormData },
            defaultFormData,
            isLoading: false,
            validToken: false
        };
    },
    methods: {
        ...mapActions({
            resetPassword: 'authentication/resetPassword'
        }),
        async submit() {
            try {
                this.isLoading = true;

                await this.resetPassword({
                    ...this.formData,
                    token: this.$route.params.token
                });

                this.$router.push('/', () => {
                    this.$notify({
                        title: 'Success',
                        type: 'success',
                        text: 'You have successfully changed your password.'
                    });
                });
            } catch (error) {
                console.error(error);
                const { status = 422 } = error.response;
                const text =
                    status === 400
                        ? 'Your Reset Password Token has expired.'
                        : status === 404
                        ? 'Invalid Token'
                        : 'Failed to reset the password.';

                this.$notify({
                    title: 'Error',
                    type: 'error',
                    text
                });
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>
