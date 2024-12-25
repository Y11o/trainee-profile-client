/**
 * Данные о группе
 * @property {string} departmentBranchName название департамента
 * @property {number} groupId идентификатор
 * @property {number} groupNumber номер группы
 * @property {IGroupMember[]} trainees стажеры, состоящие в группе
 * @property {string} videoCallTime время еженедельного митинга
 */
interface IGroupData {
  departmentBranchName: string;
  groupId: number,
  groupNumber: number,
  trainees: IGroupMember[],
  videoCallTime: string,
}

/**
 * Данные об участнике группы
 * @property {number} id идентификатор
 * @property {string} name имя
 * @property {string} surname фамилия
 * @property {string} patronymic отчество
 * @property {number} totalRatingPoints количество очков рейтинга
 * @property {number} experienceInDays стаж в днях
 * @property {string} actualStatus рабочий статус
 * @property {Date} [actualDate] дата
 * @property {string} [taskName] название задачи
 */
interface IGroupMember {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  totalRatingPoints: number;
  experienceInDays: number;
  actualStatus: string;
  actualDate?: Date;
  taskName?: string;
}

/**
 * Информация об уведомлении о последнем действии
 * @property {number} id идентификатор
 * @property {IGroupNotificationEmployeeData} employee данные стажера
 * @property {IFactType} factType тип действия
 * @property {string} text текст уведомления
 * @property {string} creationTime дата и время уведомления
 * @property {boolean} read прочитано ли уведомление
 * @property {boolean} status статус
 */
interface IGroupNotification {
  id: number;
  employee: IGroupNotificationEmployeeData;
  factType: IFactType;
  text: string;
  creationTime: string;
  read: boolean;
  status?: boolean;
}

/**
 * Информация о типе действия
 * @property {number} id идентификатор
 * @property {string} name название
 */
interface IFactType {
  id: number;
  name: string;
}

/**
 * Данные пагинации
 * @property {number} page текущая страница
 * @property {number} totalPages количество страниц
 * @property {T[]} [content] содержимое
 */
interface IPagination<T> {
  page: number;
  totalPages: number;
  content?: T[];
}

/**
 * Данные стажера
 * @property {number} id идентификатор
 * @property {string} name имя стажера
 * @property {string} surname фамилия стажера
 * @property {string} patronymic отчество стажера
 */
interface IGroupNotificationEmployeeData {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
}
