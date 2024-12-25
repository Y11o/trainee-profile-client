import type { ICalendarEvent } from '@/components/pages/MainPage/interfaces/MainPageInterfaces';

/**
 * Класс данных о мероприятиях, отображаемых в календаре событий
 */
export class CalendarModel {
  constructor(json: ICalendarEvent) {
    this.id = json.id;
    this.title = json.title;
    this.dateTime = json.timeStarted;
    this.cabinet = json.cabinet || null;
  }

  /**
   * ID записи в календаре
   */
  id: number;

  /**
   * Название меропрития
   */
  title: string;

  /**
   * Дата и время проведения мероприятия
   */
  dateTime: string;

  /**
   * Кабинет проведения мероприятия
   */
  cabinet: string | null;
}
