export default function ({ $axios, redirect }) {
    $axios.onResponseError(error => {
        const {
            status,
            config: { url }
        } = error.response;

        if (status === 403 || (status === 401 && url !== '/api/auth/login')) {
            redirect('/');
        }

        return Promise.reject(error);
    });
}
