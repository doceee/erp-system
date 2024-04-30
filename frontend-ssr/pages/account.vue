<template>
    <v-row justify="center" align="center">
        <v-col cols="12">
            <v-card width="400" class="mx-auto pa-6 rounded-lg">
                <v-card-title> Change password </v-card-title>
                <form @submit.prevent="submit($event)">
                    <v-text-field
                        v-model.trim="formData.oldPassword"
                        name="password"
                        :error-messages="oldPasswordErrors"
                        label="Old Password"
                        type="password"
                        required
                        @blur="$v.formData.oldPassword.$touch()"
                    />
                    <v-text-field
                        v-model.trim="formData.newPassword"
                        name="password"
                        :error-messages="newPasswordErrors"
                        label="New Password"
                        type="password"
                        required
                        @blur="$v.formData.newPassword.$touch()"
                    />
                    <v-text-field
                        v-model.trim="formData.newPasswordRepeat"
                        name="password"
                        :error-messages="newPasswordRepeatErrors"
                        label="Repeat New Password"
                        type="password"
                        required
                        @blur="$v.formData.newPasswordRepeat.$touch()"
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
import changePasswordValidationMixin from '../validators/changePassword.mixin';

export default {
    name: 'AccountPage',
    mixins: [changePasswordValidationMixin],
    middleware: 'isAuthenticated',
    data() {
        const defaultFormData = {
            oldPassword: '',
            newPassword: '',
            newPasswordRepeat: ''
        };

        return {
            formData: { ...defaultFormData },
            defaultFormData,
            isLoading: false
        };
    },
    methods: {
        ...mapActions({
            changePassword: 'authentication/changePassword'
        }),
        async submit() {
            this.isLoading = true;
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.changePassword(this.formData);

                this.$v.$reset();
                this.formData = { ...this.defaultFormData };
                this.$notify({
                    title: 'Success',
                    type: 'success',
                    text: 'You have successfully changed your password!'
                });
            } catch (error) {
                console.error(error);
                this.parseServerErrors(error);
            } finally {
                this.isLoading = false;
            }
        }
    }
};
</script>
