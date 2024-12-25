import axios from 'axios';
import { setAuthJwtToken } from './AuthHeaderInterceptor';

/**
 * Инстанс класса {@link axios}. Имеет параметры по умолчанию baseUrl и headers
 */
const axiosApiInstance = axios.create({
  // baseURL: 'http://192.168.24.179',     // Тестовый сервер
  baseURL: 'http://192.168.25.22',   // Стендовый сервер
});

setAuthJwtToken(axiosApiInstance);

export default axiosApiInstance;
