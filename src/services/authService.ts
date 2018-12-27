import { Api } from './Api';
import { ApiResponseData } from '@/tools/types/api/index';

export default {
    async validateApiToken() {
        const res = await Api.instance.post<ApiResponseData>('auth/validateApiToken');
        return res.data;
    },

    async login(username: string, password: string) {
        const res = await Api.instance.post<ApiResponseData>('auth/login', {
            username,
            password,
            storeApiTokenInSession: true,
        });
        return res.data;
    },

    async logoutSession() {
        const res = await Api.instance.post<ApiResponseData>('auth/logoutSession');
        return res.data;
    },
};
