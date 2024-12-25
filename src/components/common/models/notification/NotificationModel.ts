import type { INotification } from '@/components/common/interfaces/INotification';
import { EmployeeModel } from '@/components/pages/MainPage/models/employee/EmployeeModel';

export class NotificationModel {
  constructor(json: INotification) {
    this.id = json.id;
    this.createdAt = json.createdAt;
    this.isNotificationRead = json.read;
    this.message = json.message;
    this.recipient = json.recipient ? new EmployeeModel(json.recipient) : null;
    this.sender = json.sender ? new EmployeeModel(json.sender) : null;
  }

  id: number;

  message: string;

  createdAt: number;

  isNotificationRead: boolean;

  recipient: EmployeeModel | null;

  sender: EmployeeModel | null;
}
