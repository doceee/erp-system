import {
    required,
    sameAs,
    minLength,
    maxLength
} from 'vuelidate/lib/validators';
import abstractValidationMixin from './abstractValidation.mixin.js';
import passwordRestrictions from './helpers/passwordRestrictions.js';

const resetPasswordValidationMixin = {
    mixins: [abstractValidationMixin],
    validations() {
        return {
            formData: {
                oldPassword: {
                    required,
                    passwordRestrictions,
                    minLengthPassword: minLength(6),
                    maxLengthPassword: maxLength(70)
                },
                newPassword: {
                    required,
                    passwordRestrictions,
                    minLengthPassword: minLength(6),
                    maxLengthPassword: maxLength(70)
                },
                newPasswordRepeat: {
                    required,
                    passwordRestrictions,
                    minLengthPassword: minLength(6),
                    maxLengthPassword: maxLength(70),
                    sameAsNewPassword: sameAs('newPassword')
                }
            }
        };
    },
    computed: {
        oldPasswordErrors() {
            const errors = [];

            if (!this.$v.formData.oldPassword.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'oldPassword' && errors.push(err.message)
            );
            !this.$v.formData.oldPassword.required &&
                errors.push('Old Password is required');
            !this.$v.formData.oldPassword.passwordRestrictions &&
                errors.push(
                    'Password should contain minimum 6 till 70 characters with at least 1 small letter, 1 capital letter, 1 integer, 1 special character.'
                );
            !this.$v.formData.oldPassword.minLengthPassword &&
                errors.push(
                    'Old Password field must contain at least 6 characters.'
                );
            !this.$v.formData.oldPassword.maxLengthPassword &&
                errors.push('Old Password field cannot exceed 70 characters.');

            return errors;
        },
        newPasswordErrors() {
            const errors = [];

            if (!this.$v.formData.newPassword.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'newPassword' && errors.push(err.message)
            );
            !this.$v.formData.newPassword.required &&
                errors.push('New Password field is required');
            !this.$v.formData.newPassword.passwordRestrictions &&
                errors.push(
                    'New Password should contain minimum 6 till 70 characters with at least 1 small letter, 1 capital letter, 1 integer, 1 special character.'
                );
            !this.$v.formData.newPassword.minLengthPassword &&
                errors.push(
                    'New Password field must contain at least 6 characters.'
                );
            !this.$v.formData.newPassword.maxLengthPassword &&
                errors.push('New Password field cannot exceed 70 characters.');

            return errors;
        },
        newPasswordRepeatErrors() {
            const errors = [];

            if (!this.$v.formData.newPasswordRepeat.$dirty) return errors;

            this.serverValidationErrors.map(
                err =>
                    err.param === 'newPasswordRepeat' &&
                    errors.push(err.message)
            );
            !this.$v.formData.newPasswordRepeat.required &&
                errors.push('Repeat Password is required');
            !this.$v.formData.newPasswordRepeat.passwordRestrictions &&
                errors.push(
                    'Password should contain minimum 6 till 70 characters with at least 1 small letter, 1 capital letter, 1 integer, 1 special character.'
                );
            !this.$v.formData.newPasswordRepeat.minLengthPassword &&
                errors.push(
                    'Password field must contain at least 6 characters.'
                );
            !this.$v.formData.newPasswordRepeat.maxLengthPassword &&
                errors.push('Password cannot exceed 70 characters.');
            !this.$v.formData.newPasswordRepeat.sameAsNewPassword &&
                errors.push('Passwords do not match.');

            return errors;
        }
    }
};

export default resetPasswordValidationMixin;
