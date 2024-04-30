<template>
    <v-row>
        <v-dialog v-model="dialog" persistent max-width="290">
            <v-card>
                <v-card-title class="text-h5"> Confirmation </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="grey darken-3" text @click="handleClose">
                        No
                    </v-btn>
                    <v-btn
                        color="grey darken-3"
                        data-testid="submit"
                        text
                        @click="handleSubmit"
                    >
                        Yes
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>
<script>
export default {
    props: {
        isDialogOpen: {
            type: Boolean,
            required: true
        }
    },
    emits: ['close', 'submit'],
    data() {
        return {
            dialog: false
        };
    },
    watch: {
        isDialogOpen(newVal, oldVal) {
            if (oldVal !== newVal) {
                this.dialog = newVal;
            }
        }
    },
    methods: {
        handleClose() {
            this.$emit('close');
        },
        async handleSubmit() {
            await this.$emit('submit');

            this.handleClose();
        }
    }
};
</script>
