/**
 * Информация о посещаемости стажера
 * @property {IAbsentee} absentee данные стажера
 * @property {number} absenteeReason причина
 * @property {string | null} comment комментарий куратора
 * @property {string} weekSummaryDebt общее время долга
 * @property {string} mondayWorkHours отработанное время в понедельник
 * @property {string} tuesdayWorkHours отработанное время во вторник
 * @property {string} wednesdayWorkHours отработанное время в среду
 * @property {string} thursdayWorkHours отработанное время в четверг
 * @property {string} fridayWorkHours отработанное время в пятницу
 */
interface ITraineeAttendance {
  id: number;
  absentee: IAbsentee;
  absenteeReason: IAttendanceAbsenteeReason | null;
  comment: string | null;
  weekSummaryDebt: string;
  mondayWorkHours: string;
  tuesdayWorkHours: string;
  wednesdayWorkHours: string;
  thursdayWorkHours: string;
  fridayWorkHours: string;
}

interface IAbsentee {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  groupNumber: number;
}

interface IAttendanceAbsenteeReason {
  id: number;
  name: string;
}

/**
 * Время, отработанное стажером за определенный день недели
 * @property {string} dayOfWeek день недели
 * @property {string} workedTime отработанное время
 */
interface ITraineeAttendanceWeekData {
  dayOfWeek: string;
  workHours: string;
}
