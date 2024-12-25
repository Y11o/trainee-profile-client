import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import type { AxiosInstance } from 'axios';

/**
 * Перехватчик запросов, добавляющий JWT-токен (при его наличии) в заголовок
 * @param {AxiosInstance} axiosInstance экземпляр axios
 * @returns {InternalAxiosRequestConfig<any>} обновленный конфиг запроса
 */
export const setAuthJwtToken = (axiosInstance: AxiosInstance) => {
  axiosInstance.interceptors.request.use((config) => {
    const token = useUserDataStore().getJwtToken;
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  });
};
