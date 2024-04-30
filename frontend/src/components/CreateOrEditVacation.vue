<template>
    <v-row>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <form>
                    <v-card-text class="px-7 py-4">
                        <v-container>
                            <v-row>
                                <v-col v-if="isAdmin" cols="12">
                                    <v-autocomplete
                                        v-model="user"
                                        :error-messages="userIdErrors"
                                        :items="entries"
                                        :loading="isLoading"
                                        item-text="fullName"
                                        item-value="id"
                                        label="User"
                                        required
                                        hide-selected
                                        spellcheck="false"
                                        placeholder="Start typing to Search"
                                        return-object
                                        :search-input.sync="params.name"
                                        @blur="$v.formData.userId.$touch()"
                                        @keyup="searchUser"
                                        @change="changeUser"
                                    />
                                </v-col>
                                <v-col cols="12">
                                    <v-menu
                                        ref="startDateMenu"
                                        v-model="startDateMenu"
                                        :close-on-content-click="false"
                                        :return-value.sync="formData.startDate"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template #activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="selectedStartDate"
                                                :error-messages="
                                                    startDateErrors
                                                "
                                                label="Start date"
                                                readonly
                                                required
                                                v-bind="attrs"
                                                @blur="
                                                    $v.formData.startDate.$touch()
                                                "
                                                v-on="on"
                                            />
                                        </template>
                                        <v-date-picker
                                            v-model="selectedStartDate"
                                            no-title
                                            scrollable
                                            :allowed-dates="allowedDates"
                                            :min="currentDate()"
                                            @change="saveStartDate"
                                        />
                                    </v-menu>
                                </v-col>
                                <v-col cols="12">
                                    <v-menu
                                        ref="endDateMenu"
                                        v-model="endDateMenu"
                                        :close-on-content-click="false"
                                        :return-value.sync="selectedEndDate"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto"
                                    >
                                        <template #activator="{ on, attrs }">
                                            <v-text-field
                                                v-model="selectedEndDate"
                                                :error-messages="endDateErrors"
                                                label="End date"
                                                readonly
                                                required
                                                v-bind="attrs"
                                                @blur="
                                                    $v.formData.endDate.$touch()
                                                "
                                                v-on="on"
                                            />
                                        </template>
                                        <v-date-picker
                                            v-model="selectedEndDate"
                                            no-title
                                            :allowed-dates="allowedDates"
                                            scrollable
                                            :min.sync="selectedStartDate"
                                            @change="saveEndDate"
                                        />
                                    </v-menu>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions class="d-flex justify-end px-12 pb-6">
                        <v-btn
                            color="grey darken-3"
                            text
                            @click="$emit('close')"
                        >
                            Close
                        </v-btn>
                        <v-btn
                            color="grey darken-3"
                            :disabled="$v.$invalid"
                            text
                            type="submit"
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
import createOrEditVacationValidationMixin from '../validators/createOrEditVacation.mixin';
import { mapActions, mapGetters } from 'vuex';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export default {
    mixins: [createOrEditVacationValidationMixin],
    props: {
        selectedVacation: {
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
            userId: '',
            startDate: this.currentDate(),
            endDate: this.currentDate()
        };

        return {
            user: null,
            formData: { ...defaultFormData },
            defaultFormData,
            startDateMenu: false,
            endDateMenu: false,
            dialog: false,
            isLoading: false,
            params: { name: '' },
            entries: []
        };
    },
    computed: {
        ...mapGetters({
            isAdmin: 'auth/isAdmin',
            loggedUser: 'auth/loggedUser'
        }),
        selectedStartDate: {
            get() {
                return this.formData.startDate;
            },
            set(newDate) {
                this.formData.startDate = newDate;
            }
        },
        selectedEndDate: {
            get() {
                return this.formData.endDate;
            },
            set(newDate) {
                this.formData.endDate = newDate;
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
        selectedVacation(newVacation) {
            if (newVacation.id) {
                this.user = newVacation.user;
                this.entries.push(this.user);
                this.formData = { ...newVacation };
            } else {
                this.user = null;
                this.formData = { ...this.defaultFormData };
                this.formData.userId = this.isAdmin ? '' : this.loggedUser.id;
            }
        }
    },
    created() {
        this.formData.userId = this.isAdmin ? '' : this.loggedUser.id;
    },
    methods: {
        ...mapActions({
            saveVacation: 'vacations/saveVacation',
            searchUsers: 'users/searchUsers'
        }),
        changeUser(user) {
            if (user) {
                this.user = user;
                this.formData.userId = user.id;
            } else {
                this.formData.userId = '';
                this.user = null;
            }
        },
        async searchUser() {
            try {
                this.isLoading = true;

                this.entries = await this.searchUsers(this.params);
            } catch (error) {
                console.error(error);
            } finally {
                this.isLoading = false;
            }
        },
        saveStartDate(date) {
            this.$refs.startDateMenu.save(date);
            const start = dayjs(date);
            const end = dayjs(this.selectedEndDate);
            const isSameOrAfterStart = end.isSameOrAfter(start);
            this.selectedStartDate = date;

            if (!isSameOrAfterStart) {
                this.selectedEndDate = date;
            }

            this.startDateMenu = false;
        },
        saveEndDate(date) {
            this.$refs.endDateMenu.save(date);
            this.selectedEndDate = date;
            this.endDateMenu = false;
        },
        allowedDates(date) {
            const day = new Date(date);
            const dayjsDate = dayjs(day).get('day');

            return dayjsDate != 0 && dayjsDate != 6;
        },
        currentDate() {
            const day = dayjs().get('day');
            let date = dayjs();

            if (day === 6) {
                date = dayjs().add(2, 'day');
            } else if (day === 0) {
                date = dayjs().add(1, 'day');
            }

            return date.format('YYYY-MM-DD');
        },
        async handleSubmit(event) {
            event.preventDefault();
            this.$v.$touch();

            if (this.$v.$invalid) {
                return;
            }

            try {
                await this.saveVacation(this.formData);

                this.$emit('close');
                this.$notify({
                    title: 'Success',
                    type: 'success',
                    text: `Vacation request has been successfully saved!`
                });
            } catch (error) {
                console.error(error);
                this.parseServerErrors(error);
            }
        }
    }
};
</script>
