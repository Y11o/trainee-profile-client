import { BaseApi } from '@/components/common/network/base_api/BaseApi';
import type { INotification } from '@/components/common/interfaces/INotification';

export class NotificationApi extends BaseApi {
  getNotifications = async (): Promise<INotification[]> => (
    await this.axiosInstance.get<{ notificationList: INotification[] }>(`/profile${this.path}/recipient`)
  ).data.notificationList;

  setNotificationAsRead = async (id: number): Promise<void> => (
    await this.axiosInstance.put(`/profile${this.path}/change-status/${id}`, true, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  ).data;
}
