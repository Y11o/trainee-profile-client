import type { IProgressTracker } from '@/components/pages/MainPage/interfaces/MainPageInterfaces';

/**
 * Класс данных о задачах, отображаемых в треке развития
 */
export class ProgressTrackerModel {
  constructor(json: IProgressTracker) {
    this.id = json.id;
    this.name = json.name;
    this.status = json.status;
    this.type = json.type;
    this.timeStarted = new Date(json.timeStarted).toLocaleDateString('ru-RU');
    this.timeFinished = new Date(json.timeFinished).toLocaleDateString('ru-RU');
    this.certificateName = json.certificateName;
    this.certificateSendTime = json.certificateSendTime ? (new Date(json.certificateSendTime)).toLocaleDateString('ru-RU') : null;
  }

  /**
   * ID задания в треке развития
   */
  id: number;

  /**
   * Название задания
   */
  name: string;

  /**
   * Статус задания
   */
  status: string;

  /**
   * Тип задания
   */
  type: string;

  /**
   * Время начала работы над заданием
   */
  timeStarted: string;

  /**
   * Время окончания работы над заданием
   */
  timeFinished: string;

  /**
   * Название сертификата
   */
  certificateName: string | null;

  /**
   * Время отправки сертификата
   */
  certificateSendTime: string | null;
}
