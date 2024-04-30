import {
    required,
    email,
    minLength,
    maxLength
} from 'vuelidate/lib/validators';
import abstractValidationMixin from './abstractValidation.mixin.js';
import passwordRestrictions from './helpers/passwordRestrictions.js';

const loginValidationMixin = {
    mixins: [abstractValidationMixin],
    validations() {
        return {
            formData: {
                email: { required, email },
                password: {
                    required,
                    passwordRestrictions,
                    minLengthPassword: minLength(6),
                    maxLengthPassword: maxLength(70)
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
        emailErrors() {
            const errors = [];

            if (!this.$v.formData.email.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'email' && errors.push(err.message)
            );
            !this.$v.formData.email.email &&
                errors.push('Must be valid e-mail');
            !this.$v.formData.email.required &&
                errors.push('E-mail is required');

            return errors;
        }
    }
};

export default loginValidationMixin;
