/**
 * Класс данных куратора
 */
export class CuratorModel implements ICurator {
  constructor(json: ICurator) {
    this.name = json?.name || '';
    this.email = json?.email || '';
    this.patronymic = json?.patronymic || '';
    this.surname = json?.surname || '';
    this.tg = json?.tg || '';
  }

  /**
   * e-mail куратора
   */
  email: string;

  /**
   * Имя куратора
   */
  name: string;

  /**
   * Отчество куратора
   */
  patronymic?: string;

  /**
   * Фамилия куратора
   */
  surname: string;

  /**
   * Telegram куратора
   */
  tg?: string;
}
