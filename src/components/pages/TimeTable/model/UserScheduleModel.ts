import type { IRegularScheduleInterface } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';

export class UserScheduleModel {
  constructor(json: IRegularScheduleInterface) {
    this.id = json.id;
    this.dayOfWeek = json.dayOfWeek,
    this.desk =  {
      cabinet: json.desk.cabinet,
      id: json.desk.id,
      number: json.desk.number
    };
    this.startTime = json.startTime;
    this.finishTime = json.finishTime;
    this.weekIsEven = json.weekIsEven;
  }

  id: number;

  dayOfWeek: string;

  desk: object;

  startTime: string;

  finishTime: string;

  weekIsEven: boolean | null;

  get rusDayOfWeek() {
    switch (this.dayOfWeek) {
      case 'MONDAY':
        return 'Понедельник';
      case 'TUESDAY':
        return 'Вторник';
      case 'WEDNESDAY':
        return 'Среда';
      case 'THURSDAY':
        return 'Четверг';
      case 'FRIDAY':
        return 'Пятница';
      case 'SATURDAY':
        return 'Суббота';
      case 'SUNDAY':
        return 'Воскресенье';
      default:
        return 'не указано';
    }
  }
}