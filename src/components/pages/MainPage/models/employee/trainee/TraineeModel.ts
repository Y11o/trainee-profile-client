import { CuratorModel } from '../curator/CuratorModel';
import { EmployeeDetailsModel } from '../EmployeeDetailsModel';
import { MentorModel } from '../mentor/MentorModel';
import type {ITrainee} from '../../../interfaces/MainPageInterfaces';

/**
 * Класс даных стажера
 */
export class TraineeModel {
  constructor(json: ITrainee) {
    this.details = [
      new EmployeeDetailsModel('Стаж', `${json.daysInCompany || 'Не указано'}`),
      new EmployeeDetailsModel('Рейтинг', `${json.rating || 'Не указано'}`),
      new EmployeeDetailsModel('Направление', 'Не указано'),              //todo: Изменить на поле json, когда оно появится
      new EmployeeDetailsModel('Группа', `${json.group || 'Не указано'}`),
    ];
    this.curator = new CuratorModel(json.curator);
    this.mentor = new MentorModel(json.mentor);
  }

  /**
   * Подробности профиля стажера
   */
  details: EmployeeDetailsModel[]

  /**
   * Информация о кураторе стажера
   */
  curator: CuratorModel;

  /**
   * Информация о наставнике стажера
   */
  mentor: MentorModel;
}
