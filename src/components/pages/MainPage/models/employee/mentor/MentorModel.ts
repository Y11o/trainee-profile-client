/**
 * Класс даных наставника
 */
export class MentorModel implements IMentor {
  constructor(json: IMentor) {
    this.name = json?.name || '';
    this.email = json?.email || '';
    this.patronymic = json?.patronymic || '';
    this.surname = json?.surname || '';
    this.tg = json?.tg || '';
  }

  /**
   * e-mail наставника
   */
  email: string;

  /**
   * Имя наставника
   */
  name: string;

  /**
   * Отчество наставника
   */
  patronymic?: string;

  /**
   * Фамилия наставника
   */
  surname: string;

  /**
   * Telegram наставника
   */
  tg?: string;
}
