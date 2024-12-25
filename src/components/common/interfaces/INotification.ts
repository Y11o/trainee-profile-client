import type { IEmployee } from '@/components/pages/MainPage/interfaces/MainPageInterfaces';

export interface INotification {
  id: number;
  createdAt: number;
  message: string;
  read: boolean;
  recipient?: IEmployee;
  sender?: IEmployee;
}
