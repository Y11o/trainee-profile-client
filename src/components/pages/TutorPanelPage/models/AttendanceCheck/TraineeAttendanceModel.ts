/**
 * Класс данных с информацией о посещаемости стажера
 * @property {number} id идентификатор
 * @property {string} trainee ФИО стажера
 * @property {number} traineeGroupNumber номер группы стажера
 * @property {string | null} absenteeReason причина
 * @property {string | null} tutorComment комментарий куратора
 * @property {string} weekSummaryDebt общее время долга
 * @property {ITraineeAttendanceWeekData[]} attendanceData посещения стажера
 */
export class TraineeAttendanceModel {
  constructor(json: ITraineeAttendance) {
    this.id = json.id;
    this.trainee = `${json.absentee.surname} ${json.absentee.name[0]}. ${json.absentee.patronymic[0]}.`;
    this.traineeGroupNumber = json.absentee.groupNumber;
    this.absenteeReason = json.absenteeReason;
    /* eslint-disable-next-line */
    this.tutorComment = json.comment ? (json.comment === '\"\"' ? null : json.comment) : null;
    this.attendanceData = TraineeAttendanceModel.transformAttendance(json);
    this.weekSummaryDebt = json.weekSummaryDebt;
  }

  id: number;

  trainee: string;

  traineeGroupNumber: number;

  absenteeReason: IAttendanceAbsenteeReason | null;

  tutorComment: string | null;

  weekSummaryDebt: string;

  attendanceData: ITraineeAttendanceWeekData[];

  static transformAttendance(attendance: ITraineeAttendance): ITraineeAttendanceWeekData[] {
    return [
      { dayOfWeek: 'monday', workHours: attendance.mondayWorkHours },
      { dayOfWeek: 'tuesday', workHours: attendance.tuesdayWorkHours },
      { dayOfWeek: 'wednesday', workHours: attendance.wednesdayWorkHours },
      { dayOfWeek: 'thursday', workHours: attendance.thursdayWorkHours },
      { dayOfWeek: 'friday', workHours: attendance.fridayWorkHours },
    ];
  }
}
