export default {
    namespaced: true,
    actions: {
        requestResetPassword(context, email) {
            return this.$axios.post(`/api/auth/reset-password`, email);
        },
        resetPassword(context, { password, confirmPassword, token }) {
            return this.$axios.post(`/api/auth/reset-password/${token}`, {
                password,
                confirmPassword
            });
        },
        changePassword(context, data) {
            return this.$axios.post(`/api/auth/change-password/`, data);
        }
    }
};
