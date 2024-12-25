import axios from 'axios';

/**
 * Инстанс класса {@link axios}. Без токена.
 */
const axiosApiInstance = axios.create({
  // baseURL: 'http://192.168.24.179',     // Тестовый сервер
  baseURL: 'http://192.168.25.22',   // Стендовый сервер
});

axiosApiInstance.interceptors.request.use((config) => config);

export default axiosApiInstance;
