import { Api } from './Api';
import { ApiResponseData } from '@/tools/types/api';

export default {
    async fetchAccounts() {
        return Api.instance.get<ApiResponseData>('accounts');
    },
};
