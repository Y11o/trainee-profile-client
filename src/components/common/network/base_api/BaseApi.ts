import { Axios } from 'axios';
import axiosApiInstance from './AxiosApiInstance';

/**
 * Базовый класс для работы с сетью
 * @property {string} path путь до эндпоинта
 * @property {Axios} axiosInstance инстанс класса axios
 */
export class BaseApi {
  path: string;

  axiosInstance: Axios;

  constructor(path: string, axiosInstance = axiosApiInstance) {
    this.path = path;
    this.axiosInstance = axiosInstance;
  }
}
