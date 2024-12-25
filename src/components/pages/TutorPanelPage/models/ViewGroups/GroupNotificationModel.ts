/**
 * Класс данных с информацией об уведомлении о последнем действии
 * @property {number} id идентификатор
 * @property {string} text текст уведомления
 * @property {string} time дата и время уведомления
 * @property {string} factType тип действия
 * @property {string} trainee ФИО стажера
 * @property {status | undefined} status статус
 * @property {boolean} isNotificationRead прочитано ли уведомление
 */
export class GroupNotificationModel {
  constructor(json: IGroupNotification) {
    this.id = json.id;
    this.text = json.text;
    this.time = json.creationTime;
    this.status = json.status;
    this.factType = json.factType.name;
    this.trainee = `${json.employee.surname} ${json.employee.name[0]}. ${json.employee.patronymic[0]}.` || 'Не указано';
    this.isNotificationRead = json.read;
  }

  id: number;

  text: string;

  time: string;

  factType: string;

  trainee: string;

  status?: boolean;

  isNotificationRead: boolean;
}
