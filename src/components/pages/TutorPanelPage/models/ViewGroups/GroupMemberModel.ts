/**
 * Класс данных об участнике группы
 * @property {number} id идентификатор
 * @property {string} name ФИО
 * @property {number} totalRatingPoints количество очков рейтинга
 * @property {number} experienceInDays стаж в днях
 * @property {string} actualStatus рабочий статус
 * @property {Date | null} actualDate актуальная дата
 * @property {string} taskName название задачи
 * @property {boolean | undefined} isDateActual актуальность даты
 * @property {"" | "Актуальные данные"} actualityStatus актуальность данных
 */
export class GroupMemberModel {
  constructor(json: IGroupMember) {
    this.id = json.id;
    this.trainee = `${json.surname} ${json.name[0]}. ${json.patronymic[0]}.` || 'Не указано';
    this.totalRatingPoints = json.totalRatingPoints;
    this.experienceInDays = json.experienceInDays;
    this.actualStatus = json.actualStatus;
    this.actualDate = json.actualDate ? new Date(json.actualDate) : null;
    this.taskName = json?.taskName || '';
  }

  id: number;

  trainee: string;

  totalRatingPoints: number;

  experienceInDays: number;

  actualStatus: string;

  actualDate: Date | null;

  taskName: string;

  get isDateActual() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);
    if (this.actualDate) {
      return this.actualDate >= currentDate;
    } else {
      return null;
    }
  }

  get actualityStatus() {
    return this.isDateActual !== null
      ? (this.isDateActual ? 'Актуальные данные' : 'Неактуальные данные') 
      : 'Нет данных';
  }
}
