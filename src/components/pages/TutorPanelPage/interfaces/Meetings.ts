/**
 * Общая информация о митинге
 * @property {number | null} id идентификатор
 * @property {string} videoCallRecordLink ссылка на запись встречи
 * @property {string} description примечание куратора
 * @property {string} videoCallLink ссылка на встречу
 */
interface IMeetingCommonData {
  id: number | null;
  videoCallRecordLink: string;
  description: string;
  videoCallLink: string;
}

/**
 * Данные о ссылке на JIRA и статусе митинга
 * @property {string} videoCallStatus статус митинга
 * @property {string} jiraLink ссылка на JIRA
 */
interface IMeetingLinks {
  videoCallStatus: string;
  jiraLink: string;
}

/**
 * Основные данные о митинге
 * @extends {@link IMeetingCommonData}, {@link IMeetingLinks}
 * @property {number} groupNumber номер группы
 * @property {string} dateTime дата и время встречи
 * @property {string} departmentBranchName название департамента
 * @property {IMeetingMember[]} trainees стажеры группы
 */
interface IMeetingData extends IMeetingCommonData, IMeetingLinks {
  groupNumber: number;
  dateTime: string;
  departmentBranchName: string;
  trainees: IMeetingMember[];
}

/**
 * Подробные данные о митинге
 * @extends {@link IMeetingCommonData}, {@link IMeetingLinks}
 * @property {string} dateTime дата и время встречи
 * @property {string} details детали (номер группы, название департамента, дата и время встречи)
 */
interface IMeetingInfo extends IMeetingCommonData, IMeetingLinks {
  dateTime: string;
  details: string;
}

/**
 * Данные о митинге для обновления
 * @extends {@link IMeetingCommonData}
 * @property {string} timeStarted дата и время митинга
 * @property {number} leaderId идентификатор куратора
 * @property {number} statusId идентификатор статуса митинга
 */
interface INewMeetingData extends IMeetingCommonData {
  timeStarted: string;
  leaderId: number;
  statusId: number;
}

/**
 * Участники еженедельной встречи
 * @property {number | null} groupNumber номер группы
 * @property {IMeetingMember[]} trainees список стажеров группы
 */
interface IMeetingMembers {
  groupNumber: number | null;
  trainees: IMeetingMember[];
}

/**
 * Участник-стажер еженедельной встречи
 * @property {number} id идентификатор
 * @property {string} surname фамилия
 * @property {string} name имя
 * @property {string} patronymic отчество
 * @property {string} traineeStatus статус присутствия на митинге
 */
interface IMeetingMember {
  id: number;
  surname: string;
  name: string;
  patronymic: string;
  traineeStatus: string;
}

/**
 * Данные для обновления статуса присутствия на митинге
 * @property {number} traineeId идентификатор стажера
 * @property {number} attendanceStatusId идентификатор статуса присутствия на митинге
 * @property {number} videoCallId идентификатор митинга
 */
interface IAttendanceStatus {
  traineeId: number;
  attendanceStatusId: number;
  videoCallId: number;
}
