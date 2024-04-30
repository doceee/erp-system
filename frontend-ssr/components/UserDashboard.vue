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
export default {
    name: 'UserDashboard',
    computed: {
        userVacationDaysTaken() {
            return this.$store.state.auth.user?.vacationDaysTaken ?? 0;
        },
        userVacationDaysTotal() {
            return this.$store.state.auth.user?.vacationDaysTotal ?? 0;
        }
    }
};
</script>
