/**
 * Класс данных сертификата
 * @property {string} filePath путь файла
 * @property {number} groupNumber номер группы стажёра
 * @property {number} id ID записи
 * @property {string} fullName ФИО стажера, приславшего сертификат
 * @property {number} score выставленная сертификату оценка
 * @property {Date} creationTime дата отправки сертификата
 * @property {string} status статус сертификата ('Принят', 'Отклонен', 'Ожидает проверки')
 * @property {{ name: string, ref: string }} course данные курса: название и ссылка
 * @property {boolean} isCertificateRead прочитан ли сертификат
 * @property {Date | string} certificateStatusDate дата принятия/отклонения сертификата
 */
export class CertificateModel {
  constructor(json: ICertificate) {
    this.filePath = json.filePath;
    this.groupNumber = json.groupNumber;
    this.id = json.id;
    this.fullName = json.name && json.surname
      ? `${json.surname} ${json.name[0]}. ${json.patronymic[0] + '.' || ''}`
      : 'Не указано';
    this.score = +json.score;
    this.creationTime = new Date(json.creationTime);
    this.status = calculateStatus(json.status);
    this.course = {
      name: json.taskName,
      ref: json.jiraLink,
    };
    this.isCertificateRead = typeof json.status === 'boolean';
    this.certificateStatusDate = json.approvalTime
      ? (new Date(json.approvalTime)).toLocaleDateString('ru-RU')
      : 'дата не указана';
  }

  filePath: string;

  groupNumber: number;

  id: number;

  fullName: string;

  score: number;

  creationTime: Date;

  status: string;

  course: { name: string, ref: string };

  isCertificateRead: boolean;

  certificateStatusDate: Date | string;
}

const calculateStatus = (status: boolean | undefined): string => {
  if (status) {
    return 'Принят';
  } else if (status === false) {
    return 'Отклонен';
  }
  return 'Ожидает проверки';
};
