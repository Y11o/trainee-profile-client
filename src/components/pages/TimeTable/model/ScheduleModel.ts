import type { IScheduleInterface, IDesk, IUserInterface } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { UserModel } from '@/components/pages/TimeTable/model/UserModel';

export class ScheduleModel {
  constructor(json: IScheduleInterface) {
    this.id = json.id;
    this.user = json.user? new UserModel(json.user) : null;
    this.date = new Date(json.startTime);
    this.startTime = new Date(json.startTime);
    this.finishTime = new Date(json.finishTime);
    this.desk = {id: json.desk?.id, name: json.desk?.number};
    this.bookingStatus = json.bookingStatus?.name;
    this.cabinet = json.desk?.cabinet.name;
  }
 
  id: number;

  user: IUserInterface | null;

  date: Date;

  startTime: Date;

  finishTime: Date;

  cabinet: string;

  desk: IDesk;

  bookingStatus: string;

}