import {
    required,
    minLength,
    maxLength,
    minValue,
    maxValue
} from 'vuelidate/lib/validators';
import abstractValidationMixin from './abstractValidation.mixin.js';

const vacationDaysOptions = value => [20, 26].includes(value);

const createOrEditContractValidationMixin = {
    mixins: [abstractValidationMixin],
    validations() {
        const validationRules = {
            formData: {
                userId: { required },
                position: {
                    required,
                    minLengthPosition: minLength(3),
                    maxLengthPosition: maxLength(20)
                },
                startDate: { required },
                endDate: {},
                duration: {},
                vacationDaysPerYear: { required, vacationDaysOptions }
            }
        };

        if (this.hasEndDate) {
            validationRules.formData.endDate = {
                required
            };
        } else {
            validationRules.formData.duration = {
                required,
                minDuration: minValue(1),
                maxDuration: maxValue(60)
            };
        }

        return validationRules;
    },
    computed: {
        positionErrors() {
            const errors = [];

            if (!this.$v.formData.position.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'position' && errors.push(err.message)
            );
            !this.$v.formData.position.required &&
                errors.push('Position is required');
            !this.$v.formData.position.minLengthPosition &&
                errors.push(
                    'Position field must contain at least 3 characters.'
                );
            !this.$v.formData.position.maxLengthPosition &&
                errors.push('Position field cannot exceed 20 characters.');

            return errors;
        },
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
        durationErrors() {
            const errors = [];

            if (!this.$v.formData.duration.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'duration' && errors.push(err.message)
            );
            !this.$v.formData.duration.required &&
                errors.push(
                    'This field is required if End date field is not set.'
                );
            !this.$v.formData.duration.minDuration &&
                errors.push(
                    'Duration field must be of type number (min 1, max 60).'
                );
            !this.$v.formData.duration.maxDuration &&
                errors.push(
                    'Duration field must be of type number (min 1, max 60).'
                );
            return errors;
        },
        vacationDaysPerYearErrors() {
            const errors = [];

            if (!this.$v.formData.vacationDaysPerYear.$dirty) return errors;

            this.serverValidationErrors.map(
                err =>
                    err.param === 'vacationDaysPerYear' &&
                    errors.push(err.message)
            );
            !this.$v.formData.vacationDaysPerYear.required &&
                errors.push('Vacation Days field is required.');
            !this.$v.formData.vacationDaysPerYear.vacationDaysOptions &&
                errors.push(
                    'Vacation Days field must be exact number (20 or 26)'
                );
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

export default createOrEditContractValidationMixin;
