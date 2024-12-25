/**
 * Класс данных с информацией о РСС-диалоге
 * @implements {@link IRssDialogData}
 * @property {number} eventId идентификатор
 * @property {number} employeeRating рейтинг стажера
 * @property {string} eventDate дата
 * @property {IEmployeeData} employee данные стажера
 */
export class RssDialog implements IRssDialogData {
  constructor(json: IRssDialogData) {
    this.eventId = json.eventId;
    this.employee = json.employee;
    this.employeeRating = json.employeeRating;
    this.eventDate = json.eventDate ? (new Date(json.eventDate)).toLocaleDateString('ru-RU') : 'Назначить дату';
  }

  eventId: number;

  employeeRating: number;

  eventDate: string;

  employee: IEmployeeTutorPanelData;
}
