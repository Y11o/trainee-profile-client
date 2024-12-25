/**
 * Класс данных с информацией о запросе стажера
 * @property {number} id идентификатор
 * @property {string} type тип запроса
 * @property {{shortName: string, fullName: string}} trainee сокращенное и полное ФИО стажера
 * @property {Date} date дата запроса
 * @property {number} groupNumber номер группы стажера
 * @property {string} note примечание
 * @property {boolean} isRequestRead прочитан ли запрос
 * @property {boolean} isRequestApproved утвержден ли запрос
 * @property {boolean} isRequestRejected отвергнут ли запрос
 * @property {string} requestStatus статус запроса
 */
export class TraineeRequestsModel {
  constructor(json: IRequest) {
    this.id = json.id;
    this.type = json.type;
    this.trainee = {
      shortName: `${json.trainee.surname} ${json.trainee.name[0]}. ${json.trainee.patronymic[0]}.` || 'Не указано',
      fullName: `${json.trainee.surname} ${json.trainee.name} ${json.trainee.patronymic}` || 'Не указано',
    };
    this.date = new Date(json.date);
    this.groupNumber = json.groupNumber;
    this.note = json.note;
    this.isRequestRead = json.isRequestRead;
    this.isRequestApproved = json.isRequestApproved;
    this.isRequestRejected = json.isRequestRejected;
  }

  id: number;

  type: string;

  trainee: { shortName: string, fullName: string };

  date: Date;

  groupNumber: number;

  note: string;

  isRequestRead: boolean;

  isRequestApproved: boolean;

  isRequestRejected: boolean;

  get requestStatus() {
    switch (true) {
      case this.isRequestApproved:
        return 'Утвержденные запросы';
      case this.isRequestRejected:
        return 'Отвергнутые запросы';
      case !this.isRequestRead:
        return 'Новые запросы';
      default:
        return 'Активные запросы';
    }
  }
}
