/**
 * Данные РСС-диалога
 * @property {number} eventId идентификатор
 * @property {number} employeeRating рейтинг стажера
 * @property {string} eventDate дата
 * @property {IEmployeeData} employee данные стажера
 */
interface IRssDialogData {
  eventId: number,
  employeeRating: number,
  eventDate: string,
  employee: IEmployeeTutorPanelData
}

/**
 * Комментарии к РСС-диалогу
 * @property {number | null} eventId идентификатор
 * @property {string} headComment комментарий руководства
 * @property {IEmployeeData} head данные о руководстве
 * @property {string} tutorComment комментарий куратора
 * @property {IEmployeeData} tutor данные о кураторе
 */
interface IRssCommentsData {
  eventId: number | null,
  headComment: string,
  head: IEmployeeTutorPanelData,
  tutorComment: string
  tutor: IEmployeeTutorPanelData,
}

/**
 * Новая дата РСС-диалога
 * @property {number} eventId идентификатор РСС-диалога
 * @property {string} dateTime дата РСС-диалога
 */
interface INewRssDialogDate {
  eventId: number,
  dateTime: string,
}

/**
 * Новый комментарий куратора к РСС-диалогу
 * @property {number} id идентификатор РСС-диалога
 * @property {string} text текст комментария куратора
 */
interface INewRssDialogTutorComment {
  id: number,
  text: string,
}
