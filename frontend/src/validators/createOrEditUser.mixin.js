import {
    required,
    email,
    minLength,
    maxLength
} from 'vuelidate/lib/validators';
import abstractValidationMixin from './abstractValidation.mixin.js';
import passwordRestrictions from './helpers/passwordRestrictions.js';

const createOrEditUserValidationMixin = {
    mixins: [abstractValidationMixin],
    validations() {
        const validationRules = {
            formData: {
                firstName: {
                    required,
                    firstNameMinLength: minLength(3),
                    firstNameMaxLength: maxLength(10)
                },
                lastName: {
                    required,
                    lastNameMinLength: minLength(3),
                    lastNameMaxLength: maxLength(10)
                },
                birthday: { required },
                email: { required, email },
                password: {}
            }
        };

        if (!this.selectedUser.id) {
            validationRules.formData.password = {
                required,
                passwordRestrictions,
                minLengthPassword: minLength(6),
                maxLengthPassword: maxLength(70)
            };
        }

        return validationRules;
    },
    computed: {
        passwordErrors() {
            const errors = [];

            if (!this.selectedUser[0]) {
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
            }

            return errors;
        },
        firstNameErrors() {
            const errors = [];

            if (!this.$v.formData.firstName.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'firstName' && errors.push(err.message)
            );
            !this.$v.formData.firstName.required &&
                errors.push('First Name is required');
            !this.$v.formData.firstName.firstNameMinLength &&
                errors.push(
                    'First Name field must contain at least 3 characters.'
                );
            !this.$v.formData.firstName.firstNameMaxLength &&
                errors.push('First Name field cannot exceed 10 characters.');

            return errors;
        },
        lastNameErrors() {
            const errors = [];

            if (!this.$v.formData.lastName.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'lastName' && errors.push(err.message)
            );
            !this.$v.formData.lastName.required &&
                errors.push('Last Name is required');
            !this.$v.formData.lastName.lastNameMinLength &&
                errors.push(
                    'Last Name field must contain at least 3 characters.'
                );
            !this.$v.formData.lastName.lastNameMaxLength &&
                errors.push('Last Name field cannot exceed 10 characters.');

            return errors;
        },
        birthdayErrors() {
            const errors = [];

            if (!this.$v.formData.birthday.$dirty) return errors;

            this.serverValidationErrors.map(
                err => err.param === 'birthday' && errors.push(err.message)
            );
            !this.$v.formData.birthday.required &&
                errors.push('Birthday is required');

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

export default createOrEditUserValidationMixin;
