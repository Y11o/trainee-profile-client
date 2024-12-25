/**
 * Класс данных с информацией о комментариях к РСС-диалогу
 * @implements {@link IRssCommentsData}
 * @property {number | null} eventId идентификатор
 * @property {string} headComment комментарий руководства
 * @property {IEmployeeData} head данные о руководстве
 * @property {string} tutorComment комментарий куратора
 * @property {IEmployeeData} tutor данные о кураторе
 */
export class RssComments implements IRssCommentsData {
  constructor(json: IRssCommentsData) {
    this.eventId = json.eventId || null;
    this.headComment = json.headComment;
    this.head = json.head;
    this.tutorComment = json.tutorComment;
    this.tutor = json.tutor;
  }

  eventId: number | null;

  headComment: string;

  head: IEmployeeTutorPanelData;

  tutorComment: string;

  tutor: IEmployeeTutorPanelData;
}
