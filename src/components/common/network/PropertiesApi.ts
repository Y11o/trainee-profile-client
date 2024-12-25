import { BaseApi } from '@/components/common/network/base_api/BaseApi';

export class PropertiesApi extends BaseApi {
  /**
   * Метод получения данных о версии серверного приложения ЛК
   */
  getProfileVersion = async (): Promise<{ version: string }> => (
    await this.axiosInstance.get(`/profile${this.path}/version`)
  ).data;

  /**
   * Метод получения данных о версии серверного приложения сервиса расписания
   */
  getScheduleVersion = async (): Promise<{ version: string }> => (
    await this.axiosInstance.get(`/schedule${this.path}/version`)
  ).data;
}
