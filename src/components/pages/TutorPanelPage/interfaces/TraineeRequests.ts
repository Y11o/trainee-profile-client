/**
 * Данные о запросе стажера
 * @property {number} id идентификатор
 * @property {string} type тип запроса
 * @property {{ surname: string, name: string, patronymic: string }} trainee фамилия, имя и отчество стажера
 * @property {Date} date дата запроса
 * @property {number} groupNumber номер группы стажера
 * @property {string} note примечание
 * @property {boolean} isRequestRead прочитан ли запрос
 * @property {boolean} isRequestApproved утвержден ли запрос
 * @property {boolean} isRequestRejected отвергнут ли запрос
 */
interface IRequest {
  id: number,
  type: string,
  trainee: { surname: string, name: string, patronymic: string },
  date: Date,
  groupNumber: number,
  note: string,
  isRequestRead: boolean,
  isRequestApproved: boolean,
  isRequestRejected: boolean
}
