import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        if (typeof error?.response?.data === "string") {
            toast.error(error.response.data);
        }

        return Promise.reject(error);
    }
);

export default api;