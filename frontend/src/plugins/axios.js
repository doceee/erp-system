import globalAxios from 'axios';
import { apiUrl } from '../config';

const axios = globalAxios.create({
    baseURL: apiUrl,
    withCredentials: true
});

axios.interceptors.response.use(
    response => response,
    error => {
        const {
            status,
            config: { url }
        } = error.response;

        if (status === 403 || (status === 401 && url !== '/api/auth/login')) {
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default axios;
