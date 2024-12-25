import type { IUserInterface } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';

export class UserModel {
  constructor(json: IUserInterface) {
    this.id = json.id;
    this.name = json.name;
    this.surname = json.surname;
    this.patronymic = json.patronymic;
    this.role = json.role;
  }
 
  id: number;

  name: string;

  patronymic: string;

  surname: string;

  role: object;

  get fullName() {
    return `${this.surname} ${this.name} ${this.patronymic}` || 'Не указано';
  }

  get shortName() {
    return  `${this.surname} ${this.name[0]}.${this.patronymic[0]}.` || 'Не указано';
  }
}