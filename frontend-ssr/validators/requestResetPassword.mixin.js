import { required, email } from 'vuelidate/lib/validators';
import abstractValidationMixin from './abstractValidation.mixin.js';

const emailValidationMixin = {
    mixins: [abstractValidationMixin],
    validations() {
        return {
            formData: {
                email: { required, email }
            }
        };
    },
    computed: {
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

export default emailValidationMixin;
