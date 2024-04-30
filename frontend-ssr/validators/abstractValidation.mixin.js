import { validationMixin } from 'vuelidate';

const abstractValidationMixin = {
    mixins: [validationMixin],
    data() {
        return {
            serverValidationErrors: []
        };
    },
    methods: {
        clearServerErrors() {
            this.serverValidationErrors = [];
        },
        parseServerErrors(error) {
            this.serverValidationErrors = [];

            if (!error.response) return;

            if (error.response.status === 400) {
                this.serverValidationErrors =
                    error.response?.data?.errors || [];

                return this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: 'There were some errors in the form'
                });
            } else if (error.response.status === 500) {
                return this.$notify({
                    title: 'Error',
                    type: 'error',
                    text: 'Unexpected error occured'
                });
            }
        }
    }
};

export default abstractValidationMixin;
