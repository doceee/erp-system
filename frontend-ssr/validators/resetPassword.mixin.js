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
                password: {
                    required,
                    passwordRestrictions,
                    minLengthPassword: minLength(6),
                    maxLengthPassword: maxLength(70)
                },
                confirmPassword: {
                    required,
                    passwordRestrictions,
                    minLengthPassword: minLength(6),
                    maxLengthPassword: maxLength(70),
                    sameAsPassword: sameAs('password')
                }
            }
        };
    },
    computed: {
        passwordErrors() {
            const errors = [];

            if (!this.$v.formData.password.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'password' && errors.push(err.message)
            );
            !this.$v.formData.password.required &&
                errors.push('Password is required');
            !this.$v.formData.password.passwordRestrictions &&
                errors.push(
                    'Password should contain minimum 6 till 70 characters with at least 1 small letter, 1 capital letter, 1 integer, 1 special character.'
                );
            !this.$v.formData.password.minLengthPassword &&
                errors.push(
                    'Password field must contain at least 6 characters.'
                );
            !this.$v.formData.password.maxLengthPassword &&
                errors.push('Password field cannot exceed 70 characters.');

            return errors;
        },
        confirmPasswordErrors() {
            const errors = [];

            if (!this.$v.formData.confirmPassword.$dirty) return errors;

            this.serverValidationErrors.map(
                err =>
                    err.param === 'confirmPassword' && errors.push(err.message)
            );
            !this.$v.formData.confirmPassword.required &&
                errors.push('Confirm Password field is required');
            !this.$v.formData.confirmPassword.passwordRestrictions &&
                errors.push(
                    'Password should contain minimum 6 till 70 characters with at least 1 small letter, 1 capital letter, 1 integer, 1 special character.'
                );
            !this.$v.formData.confirmPassword.minLengthPassword &&
                errors.push(
                    'Confirm Password field must contain at least 6 characters.'
                );
            !this.$v.formData.confirmPassword.maxLengthPassword &&
                errors.push(
                    'Confirm Password field cannot exceed 70 characters.'
                );
            !this.$v.formData.confirmPassword.sameAsPassword &&
                errors.push('Passwords do not match.');

            return errors;
        }
    }
};

export default resetPasswordValidationMixin;
