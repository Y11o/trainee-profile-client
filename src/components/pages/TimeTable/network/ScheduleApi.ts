import { BaseApi } from '@/components/common/network/base_api/BaseApi';
import { NoAuthBaseApi } from '@/components/common/network/no_auth_api/BaseApi';
import type { IEmployeesListItemInterface, IReservationData, IScheduleDisplayInterface, IScheduleInterface, IUserSchedule } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';

export class ScheduleApi extends BaseApi {
  addReservation = async (data: IReservationData): Promise<IScheduleInterface[]> =>
    (await this.axiosInstance.post(`${this.path}/intervals/valid/create`, data)).data;

  createUser = async (): Promise<string> =>
    (await this.axiosInstance.get(`${this.path}/users/valid/create`)).data;

  deleteUserInterval = async (data: number) =>
    (await this.axiosInstance.delete(`${this.path}/intervals/delete/${data}`)).data;
}

export class NoAuthScheduleApi extends NoAuthBaseApi {
  getEmployeeNames = async (): Promise<IEmployeesListItemInterface[]> =>
    (await this.axiosInstance.get(`${this.path}/users/min-data`)).data;

  getScheduleByDate = async (data: { date: string }): Promise<IScheduleInterface[]> =>
    (await this.axiosInstance.post(`${this.path}/intervals/by-date`, data)).data;

  getUserSchedule = async (data: number | number[]): Promise<IUserSchedule> =>
    (await this.axiosInstance.get(`${this.path}/regular-schedule/my-schedule/${data}`)).data;

  getFreeScheduleByDate = async (data: { date: string }): Promise<IScheduleInterface[]> =>
    (await this.axiosInstance.post(`${this.path}/intervals/free/by-date`, data)).data;

  getScheduleByDateAndDesk = async (data: { date: string, desk: { id: number } }): Promise<IScheduleInterface[]> =>
    (await this.axiosInstance.post(`${this.path}/intervals/by-date-and-desk`, data)).data;

  getFreeScheduleByDateAndDesk = async (data: { date: string, desk: { id: number } }): Promise<IScheduleInterface[]> =>
    (await this.axiosInstance.post(`${this.path}/intervals/free/by-date-and-desk`, data)).data;

  getIntervals = async (): Promise<IScheduleDisplayInterface[]> =>
    (await this.axiosInstance.get(`${this.path}/intervals`)).data;
}
