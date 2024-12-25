/**
 * Данные о заданиях и курсах, доступных для выбора
 * @property {ITask[]} practices массив пр. заданий типа ITask
 * @property {ICourse[]} courses массив курсов типа ICourse
 */
interface ITasksCourses {
  practices: ITask[];
  courses: ICourse[];
}

/**
 * Данные о задании
 * @property {number} id ID задания
 * @property {string} name название задания
 */
interface ITask {
  id: number;
  name: string;
}

/**
 * Данные о курсе
 * @property {number} id ID курса
 * @property {string} name название курса
 */
interface ICourse {
  id: number;
  name: string;
}

/**
 * Данные о выбранном сотруднике для совместного выполнения пр. задания
 * @property {number} id ключ для директивы v-for
 * @property {EmployeeData | null} traineeData данные о сотруднике
 */
interface SelectedPerson {
  id: number;
  employeeData: EmployeeData | null;
}

/**
 * Данные о сотруднике (для выбора в команду при выборе пр. задания)
 * @property {number} id ID сотрудника
 * @property {string} fullName полное имя сотрудника
 * @property {string} role роль сотрудника
 */
interface EmployeeData {
  id: number;
  fullName: string;
  role: {
    id: number,
    name: string
  };
}
