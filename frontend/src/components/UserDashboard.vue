<template>
    <div>
        <h4 class="text-body-1">
            Number of holiday taken:
            <strong>{{ userVacationDaysTaken }}</strong>
        </h4>
        <h4 class="text-body-1">
            Number of allocated leave:
            <strong>{{ userVacationDaysTotal }}</strong>
        </h4>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'UserDashboard',
    computed: {
        ...mapGetters({
            loggedUser: 'auth/loggedUser'
        }),
        userVacationDaysTaken() {
            return (this.loggedUser && this.loggedUser.vacationDaysTaken) ?? 0;
        },
        userVacationDaysTotal() {
            return (this.loggedUser && this.loggedUser.vacationDaysTotal) ?? 0;
        }
    }
};
</script>
