import { BaseApi } from '@/components/common/network/base_api/BaseApi';

/**
 * Класс для работы с сетью в рамках ПУ Ассистента
 * @extends {@link BaseApi}
 */
export class AssistantPanelApi extends BaseApi {
  /** Метод получения информации о сертификатах */
  getCertificatesByTutor = async (): Promise<ICertificate[]> => (
    await this.axiosInstance.get(`/profile${this.path}/facts/get-certificates`)
  ).data;

  /**
   * Метод обновления статуса сертификата по id
   * @param {number} id идентификатор сертификата
   * @param {INewCertificateStatus} data данные сертификата, необходимыые для смены статуса
   */
  setCertificateStatus = async (id: number, data: INewCertificateStatus): Promise<void> => (
    await this.axiosInstance.patch(`/profile${this.path}/facts/set-status/${id}`, data)
  );

  /**
   * Метод загрузки Excel-файла с даннымии системы СКУД за неделю
   * @param data Excel-файл
   */
  uploadWeekScudData = async (data: FormData): Promise<void> =>
    await this.axiosInstance.post('/profile/scud-attendance/upload-attendance', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
}
