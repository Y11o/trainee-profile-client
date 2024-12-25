/**
 * Данные внутренней встречи
 * @property {number} eventId идентификатор
 * @property {IEmployeeData} employee данные стажера
 * @property {{id: number, name: string}} eventStatus статус встречи
 * @property {number} groupNumber номер группы стажера
 * @property {string} timeStarted дата и время
 * @property {string} title название
 * @property {string} departmentName название департамента
 * @property {string} comment комментарий
 */
interface IInternalMeetingData {
  eventId: number;
  employee: IEmployeeTutorPanelData;
  eventStatus: { id: number, name: string };
  groupNumber: number;
  timeStarted: string;
  title: string;
  departmentName: string;
  comment: string;
}

/**
 * Детали внутренней встречи
 * @extends {@link IInternalMeetingData}
 * @property {{cabinet: string, timeStarted: number, title: string}} event данные о месте, названии и времени встречи
 * @property {IInternalMeetingMember[]} members участники встречи
 */
interface IInternalMeetingInfoData extends IInternalMeetingData{
  event: { cabinet: string, timeStarted: number, title: string };
  members: IInternalMeetingMember[];
}

/**
 * Участник внутренней встречи
 * @property {number} employeeId идентификатор участника
 * @property {string} name имя
 * @property {string} surname фамилия
 * @property {string} patronymic отчество
 * @property {{ name: string }} role роль на встрече
 */
interface IInternalMeetingMember {
  employeeId: number;
  name: string;
  surname: string;
  patronymic: string;
  role: { name: string };
}
