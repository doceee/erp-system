<template>
    <v-row>
        <v-dialog v-model="dialog" persistent max-width="600px">
            <v-card>
                <form>
                    <v-card-text class="px-7 py-4">
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-autocomplete
                                        v-model="user"
                                        :error-messages="userIdErrors"
                                        :items="entries"
                                        :loading="isLoading"
                                        item-text="fullName"
                                        item-value="id"
                                        label="User"
                                        hide-no-data
                                        required
                                        spellcheck="false"
                                        placeholder="Start typing to Search"
                                        :search-input.sync="params.name"
                                        return-object
                                        @blur="$v.formData.userId.$touch()"
                                        @keyup="searchUser"
                                        @change="changeUser"
                                    />
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-text-field
                                        v-model.trim="formData.position"
                                        :error-messages="positionErrors"
                                        label="Position"
                                        name="position"
                                        spellcheck="false"
                                        required
                                        @blur="$v.formData.position.$touch()"
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
                                            @change="saveStartDate"
                                        />
                                    </v-menu>
                                </v-col>
                                <v-col cols="12">
                                    <v-switch
                                        v-model="hasEndDate"
                                        :label="`Selected: ${
                                            hasEndDate ? 'End date' : 'Duration'
                                        }`"
                                    />
                                </v-col>
                                <v-col v-if="hasEndDate" cols="12">
                                    <v-menu
                                        ref="endDateMenu"
                                        v-model="endDateMenu"
                                        :close-on-content-click="false"
                                        :return-value.sync="formData.endDate"
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
                                            scrollable
                                            :min.sync="formData.startDate"
                                            @change="saveEndDate"
                                        />
                                    </v-menu>
                                </v-col>
                                <v-col v-else cols="12" sm="12">
                                    <v-text-field
                                        v-model.trim="formData.duration"
                                        :error-messages="durationErrors"
                                        label="Duration"
                                        name="duration"
                                        required
                                        @blur="$v.formData.duration.$touch()"
                                    />
                                </v-col>
                                <v-col cols="12" sm="12">
                                    <v-select
                                        v-model.trim="
                                            formData.vacationDaysPerYear
                                        "
                                        :error-messages="
                                            vacationDaysPerYearErrors
                                        "
                                        :items="vacationDaysPerYearOptions"
                                        label="Vacation Days Per Year"
                                        name="vacationDaysPerYear"
                                        required
                                        @blur="
                                            $v.formData.vacationDaysPerYear.$touch()
                                        "
                                    />
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
import createOrEditContractValidationMixin from '../validators/createOrEditContract.mixin';
import { mapActions, mapGetters } from 'vuex';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrAfter);

export default {
    mixins: [createOrEditContractValidationMixin],
    props: {
        selectedContract: {
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
            position: '',
            startDate: this.currentDate(),
            endDate: '',
            duration: null,
            vacationDaysPerYear: 20
        };

        return {
            user: null,
            vacationDaysPerYearOptions: [20, 26],
            hasEndDate: true,
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
            isAdmin: 'auth/isAdmin'
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
        selectedContract(newContract) {
            if (newContract.id) {
                this.user = newContract.user;
                this.entries.push(this.user);
                this.formData = { ...newContract };
            } else {
                this.user = null;
                this.formData = { ...this.defaultFormData };
            }
        }
    },
    methods: {
        ...mapActions({
            saveContract: 'contracts/saveContract',
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
                await this.saveContract({
                    ...this.formData,
                    duration: this.hasEndDate ? null : this.formData.duration,
                    endDate: this.hasEndDate ? this.formData.endDate : null
                });

                this.$emit('close');
                this.$notify({
                    title: 'Success',
                    type: 'success',
                    text: `Contract has been successfully saved!`
                });
            } catch (error) {
                console.error(error);
                this.parseServerErrors(error);
            }
        },
        saveStartDate(date) {
            this.$refs.startDateMenu.save(date);
            const start = dayjs(date);
            this.selectedStartDate = date;

            if (this.hasEndDate) {
                const end = dayjs(this.selectedEndDate);
                const isSameOrAfterStart = end.isSameOrAfter(start);

                if (!isSameOrAfterStart) {
                    this.selectedEndDate = date;
                }
            }

            this.startDateMenu = false;
        },
        saveEndDate(date) {
            this.$refs.endDateMenu.save(this.formData.endDate);
            this.selectedEndDate = date;
            this.endDateMenu = false;
        }
    }
};
</script>
