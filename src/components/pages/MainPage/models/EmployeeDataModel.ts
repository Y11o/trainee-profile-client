import { CalendarModel } from './calendar/CalendarModel';
import { ProgressTrackerModel } from './progressTracker/ProgressTrackerModel';
import { EmployeeModel } from './employee/EmployeeModel';
import type { IEmployeeData } from '../interfaces/MainPageInterfaces';

/**
 * Класс данных с полной информацией, отображаемой на главной странице
 */
export class EmployeeDataModel {
  constructor(json: IEmployeeData) {
    this.employee = new EmployeeModel(json.employee);
    this.calendarEvents = json?.calendar?.map((e) => new CalendarModel(e)) || [];
    this.trackerTasks = json?.progressTracker?.map((e) => new ProgressTrackerModel(e)) || [];

    if (this.trackerTasks && this.trackerTasks.length) {
      this.trackerTasks.sort((a: ProgressTrackerModel, b: ProgressTrackerModel) => {
        const statusOrder = { 'Закрыт': 0, 'Просрочено': 1, 'В работе': 2, 'Ожидает подтверждения куратора': 3 };
        const typeOrder = { 'Курс': 0, 'Практ. задание': 1, 'Проект': 2 };
        const statusComparison = statusOrder[a.status] - statusOrder[b.status];
        if (statusComparison !== 0) {
          return statusComparison;
        } else {
          const aHasTime = a.timeStarted !== '-' && a.timeFinished !== '-';
          const bHasTime = b.timeStarted !== '-' && b.timeFinished !== '-';
          if (aHasTime && !bHasTime) {
            return -1;
          } else if (!aHasTime && bHasTime) {
            return 1;
          } else {
            const typeComparison = typeOrder[a.type] - typeOrder[b.type];
            if (typeComparison !== 0) {
              return typeComparison;
            }
          }
        }
      });
    }
  }

  /**
   * Информация о сотруднике
   */
  employee: EmployeeModel;

  /**
   * Список мероприятий в календаре
   */
  calendarEvents: CalendarModel[];

  /**
   * Список заданий в треке развития
   */
  trackerTasks: ProgressTrackerModel[];
}
