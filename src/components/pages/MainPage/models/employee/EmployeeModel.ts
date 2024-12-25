import type { IEmployee, ITrainee } from '../../interfaces/MainPageInterfaces';
import { TraineeModel } from './trainee/TraineeModel';
import { RoleEnum as Roles } from '@/components/common/constants/RoleEnum';

/**
 * Класс данных о сотруднике
 */
export class EmployeeModel {
  constructor(json: IEmployee) {
    this.fullName = json.name && json.surname ? `${json.surname} ${json.name} ${json.patronymic || ''}` : 'Не указано';
    this.role = this.getRoleValue(json.role);
    this.photoUrl = json.photoUrl || '@/assets/img/main-page/400x400.png';
    this.traineeInfo = new TraineeModel(json.trainee);
  }

  /**
   * ФИО сотрудника
   */
  fullName: string;

  /**
   * Должность сотрудника
   */
  role: string;

  /**
   * Ссылка на фото сотрудника
   */
  photoUrl: string;

  /**
   * Информация о стажере
   */
  traineeInfo: ITrainee;

  getRoleValue(roleKey: string): string {
    const keys = Object.keys(Roles);
    const values = Object.values(Roles);
    if (keys.includes(roleKey)) {
      return values[keys.indexOf(roleKey)] as string;
    }
    return 'Не указано';
  }
}
