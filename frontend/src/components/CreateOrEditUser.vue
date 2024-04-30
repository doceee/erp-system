<template>
    <v-row>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <form>
                    <v-card-text class="px-7 py-4">
                        <v-container>
                            <v-row>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model.trim="formData.firstName"
                                        :error-messages="firstNameErrors"
                                        label="First name"
                                        name="first-name"
                                        required
                                        @blur="$v.formData.firstName.$touch()"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field
                                        v-model.trim="formData.lastName"
                                        :error-messages="lastNameErrors"
                                        label="Last name"
                                        name="last-name"
                                        required
                                        @blur="$v.formData.lastName.$touch()"
                                    ></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-menu
                                        ref="birthdayMenu"
                                        v-model="birthdayMenu"
                                        :close-on-content-click="false"
                                        :return-value.sync="formData.birthday"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template #activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="selectedBirthday"
                                                :error-messages="birthdayErrors"
                                                label="Birthday"
                                                readonly
                                                required
                                                v-bind="attrs"
                                                @blur="
                                                    $v.formData.birthday.$touch()
                                                "
                                                v-on="on"
                                            ></v-text-field>
                                        </template>
                                        <v-date-picker
                                            v-model="selectedBirthday"
                                            no-title
                                            scrollable
                                            :max="defaultFormData.birthday"
                                            min="1900-01-01"
                                            @change="saveBirthday"
                                        >
                                        </v-date-picker>
                                    </v-menu>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field
                                        v-model.trim="formData.email"
                                        :error-messages="emailErrors"
                                        label="E-mail"
                                        name="email"
                                        type="email"
                                        required
                                        @blur="$v.formData.email.$touch()"
                                    ></v-text-field>
                                </v-col>
                                <v-col v-if="!selectedUser.id" cols="12">
                                    <v-text-field
                                        v-model.trim="formData.password"
                                        :error-messages="passwordErrors"
                                        label="Password"
                                        name="password"
                                        type="password"
                                        placeholder="placeholder"
                                        required
                                        @blur="$v.formData.password.$touch()"
                                    ></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-end px-12 pb-6">
                        <v-btn
                            color="grey darken-3"
                            text
                            data-testid="close"
                            @click="$emit('close')"
                        >
                            Close
                        </v-btn>
                        <v-btn
                            color="grey darken-3"
                            :disabled="$v.$invalid"
                            text
                            data-testid="submit"
                            @click="handleSubmit($event)"
                        >
                            Save
                        </v-btn>
                    </v-card-actions>
                </form>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
import createOrEditUserValidationMixin from '../validators/createOrEditUser.mixin';
import { mapActions } from 'vuex';
import dayjs from 'dayjs';

export default {
    mixins: [createOrEditUserValidationMixin],
    props: {
        selectedUser: {
            default: () => {},
            type: Object,
            required: false
        },
        isDialogOpen: {
            type: Boolean,
            required: true
        }
    },
    emits: ['close'],
    data() {
        const defaultFormData = {
            id: '',
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            birthday: dayjs().format().substr(0, 10)
        };

        return {
            formData: { ...defaultFormData },
            defaultFormData,
            birthdayMenu: false,
            dialog: false
        };
    },
    computed: {
        selectedBirthday: {
            get() {
                return this.formData.birthday;
            },
            set(newDate) {
                this.formData.birthday = newDate;
            }
        }
    },
    watch: {
        isDialogOpen(newVal, oldVal) {
            if (oldVal !== newVal) {
                this.clearServerErrors();
                this.$v.$reset();
                this.dialog = newVal;
            }
        },
        selectedUser(newUser) {
            if (newUser.id) {
                this.formData = { ...newUser };
            } else {
                this.formData = { ...this.defaultFormData };
            }
        }
    },
    methods: {
        ...mapActions({
            saveUser: 'users/saveUser'
        }),
        async handleSubmit(event) {
            event.preventDefault();
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.saveUser(this.formData);

                this.$emit('close');
                this.$notify({
                    title: 'Success',
                    type: 'success',
                    text: `User has been successfully saved!`
                });
            } catch (error) {
                console.error(error);
                this.parseServerErrors(error);
            }
        },
        saveBirthday(date) {
            this.$refs.birthdayMenu.save(date);
            this.selectedBirthday = date;
            this.birthdayMenu = false;
        }
    }
};
</script>
