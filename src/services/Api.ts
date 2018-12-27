import axios from 'axios';

export const Api = {
    get instance() {
        const axiosInstance = axios.create({
            baseURL: `http://localhost:8081`,
            withCredentials: true,
        });

        return axiosInstance;
    },
};
