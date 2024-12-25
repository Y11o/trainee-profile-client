/**
 * Класс данных с информацией об участнике митинга
 * @property {number} id идентификатор
 * @property {string} fullName ФИО
 * @property {string} traineeStatus статус присутствия на митинге
 */
export class MeetingMemberModel {
  constructor(json: IMeetingMember) {
    this.id = json.id;
    this.fullName = `${json.surname} ${json.name[0]}. ${json.patronymic[0]}.` || 'Не указано';
    this.traineeStatus = json.traineeStatus || 'Выбрать';
  }

  id: number;

  fullName: string;

  traineeStatus: string;
}
