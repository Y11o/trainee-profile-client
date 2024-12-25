/**
 * Класс данных с информацией о внутренней встрече
 * @implements {@link IInternalMeetingData}
 * @property {number} eventId идентификатор
 * @property {IEmployeeData} employee данные стажера
 * @property {{id: number, name: string}} eventStatus статус встречи
 * @property {number} groupNumber номер группы стажера
 * @property {string} timeStarted дата и время
 * @property {string} title название
 * @property {string} departmentName название департамента
 * @property {string} comment комментарий
 */
export class InternalMeetingModel implements IInternalMeetingData {
  constructor(json: IInternalMeetingData) {
    this.eventId = json.eventId;
    this.employee = json.employee;
    this.eventStatus = json.eventStatus;
    this.groupNumber = json.groupNumber;
    this.timeStarted = json.timeStarted ? new Date(json.timeStarted).toLocaleString('ru-RU') : 'Не указано';
    this.title = json.title;
    this.departmentName = json.departmentName;
    this.comment = json.comment;
  }

  eventId: number;

  employee: IEmployeeTutorPanelData;

  eventStatus: { id: number, name: string };

  groupNumber: number;

  timeStarted: string;

  departmentName: string;

  title: string;

  comment: string;
}
