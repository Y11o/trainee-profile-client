/**
 * Класс данных о сотруднике, отображаемых в формате "ключ-значение"
 */
export class EmployeeDetailsModel {
  constructor(name: string, content = 'Не указано') {
    this.rowName = name;
    this.content = content;
  }

  /**
   * Заголовок строки в подробной информации о стажере
   */
  rowName: string;

  /**
   * Содержание информации в подробной информации о стажере
   */
  content: string;
}