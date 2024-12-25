import type { EmployeeDetailsModel } from '../models/employee/EmployeeDetailsModel';

/**
 * Данные для главной страницы
 * @property {IEmployee} trainee данные стажера
 * @property {ICalendarEvent[]} calendar данные для отображения в календаре
 * @property {IProgressTracker[]} progressTracker данные для отображения в треке развития
 */
export interface IEmployeeData {
  employee: IEmployee;
  calendar: ICalendarEvent[];
  progressTracker: IProgressTracker[];
}

/**
 * Данные сотрудника
 * @property {string} name имя сотрудника
 * @property {string} patronymic отчество сотрудника
 * @property {string} surname фамилия сотрудника
 * @property {number} daysInCompany стаж работы в компании (в днях)
 * @property {string} role должность сотрудника
 * @property {string} photoUrl ссылка на фотографию сотрудника
 * @property {number} group номер группы (актуально для стажера)
 * @property {number} rating рейтинг (актуально для стажера)
 * @property {IMentor} mentor данные о наставнике (актуально для стажера)
 * @property {ICurator} curator данные о кураторе (актуально для стажера)
 */
export interface IEmployee {
  name: string;
  patronymic: string;
  surname: string;
  role: string;
  photoUrl: string;
  trainee: ITrainee
}

/**
 * Данные стажера
 * @property {number} daysInCompany кол-во дней в компании
 * @property {number} rating рейтинг
 * @property {string} dept направление
 * @property {string} group группа
 * @property {ICurator} curator данные куратора
 * @property {IMentor} mentor данные наставника
 */
export interface ITrainee {
  daysInCompany?: number,
  rating?: number,
  dept?: string,
  group?: string,
  curator: ICurator,
  mentor: IMentor,
  details?: EmployeeDetailsModel[]
}

/**
 * Данные куратора
 * @property {string} email почта куратора
 * @property {string} name имя куратора
 * @property {string} patronymic отчество куратора
 * @property {string} surname фамилия куратора
 * @property {string} tg Telegram куратора
 */
interface ICurator {
  email: string;
  name: string;
  patronymic?: string;
  surname: string;
  tg?: string;
}

/**
 * Данные наставника
 */
type IMentor = ICurator

/**
 * Данные мероприятия для календаря
 * @property {string} cabinet номер кабинета, в котором проходит мероприятие
 * @property {string} description описание мероприятия
 * @property {number} id ID мероприятия
 * @property {string} status актуальный статус мероприятия
 * @property {string} timeStarted время начала мероприятия
 * @property {string} title название мероприятия
 */
export interface ICalendarEvent {
  cabinet?: string;
  description: string;
  id: number;
  status: string;
  timeStarted: string;
  title: string;
}

/**
 * Данные задания для трека развития
 * @property {number} id ID пр. задания/курса
 * @property {string} name название пр. задания/курса
 * @property {string} status актуальный статус пр. задания/курса
 * @property {string} timeStarted время начала работы над пр. заданием/курсом
 * @property {string} timeFinished время окончания работы над пр. заданием/курсом
 * @property {string} type тип пр. задания/курса
 * @property {string | null} certificateName название загруженного сертификата курса
 * @property {string | null} certificateSendTime дата отправки сертификата на проверку
 */
export interface IProgressTracker {
  id: number;
  name: string;
  status: string;
  timeFinished: string;
  timeStarted: string;
  type: string;
  certificateName: string | null;
  certificateSendTime: string | null;
}

/**
 * Данные для отображения информации и соответствующих цветов статусов задач
 * @property {string} color цвет плашки статуса в таблице, основной цвет фильтра
 * @property {string} textColor цвет текста статуса в строке таблицы
 * @property {number} value статус
 * @property {string} tooltip описание статуса
 */
export interface ITaskStatus {
  color: string;
  textColor?: string;
  value: string;
  tooltip: string;
}

/**
 * Данные о задании, отправляемом в еженедельном отчете
 * @property {number} taskId идентификатор задания
 * @property {number} timeSpent количество часов, потраченных на задание за неделю
 */
export interface IReportedTask {
  taskId: number;
  timeSpent: number;
}
