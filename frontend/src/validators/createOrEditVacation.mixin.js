import { required } from 'vuelidate/lib/validators';
import abstractValidationMixin from './abstractValidation.mixin.js';

const createOrEditVacationValidationMixin = {
    mixins: [abstractValidationMixin],
    validations() {
        return {
            formData: {
                startDate: { required },
                endDate: { required },
                userId: { required }
            }
        };
    },
    computed: {
        startDateErrors() {
            const errors = [];

            if (!this.$v.formData.startDate.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'startDate' && errors.push(err.message)
            );
            !this.$v.formData.startDate.required &&
                errors.push('Start date is required');

            return errors;
        },
        endDateErrors() {
            const errors = [];

            if (!this.$v.formData.endDate.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'endDate' && errors.push(err.message)
            );
            !this.$v.formData.endDate.required &&
                errors.push('End date is required');

            return errors;
        },
        userIdErrors() {
            const errors = [];

            if (!this.$v.formData.userId.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'userId' && errors.push(err.message)
            );
            !this.$v.formData.userId.required &&
                errors.push('User is required');

            return errors;
        }
    }
};

export default createOrEditVacationValidationMixin;
