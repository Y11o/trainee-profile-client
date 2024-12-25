/**
 * Интерфейс данных сертификата
 * @property {string} filePath путь файла
 * @property {number} groupNumber номер группы стажёра
 * @property {number} id ID записи
 * @property {string} jiraLink ссылка на курс
 * @property {string} name имя стажера, приславшего сертификат
 * @property {string} patronymic отчество стажера, приславшего сертификат
 * @property {number} score выставленная сертификату оценка
 * @property {number} creationTime дата отправки сертификата
 * @property {boolean | undefined} status статус сертификата
 * @property {string} surname фамилия стажера, приславшего сертификат
 * @property {string} taskName название курса
 * @property {boolean} isCertificateRead прочитан ли сертификат
 * @property {string | undefined} approvalTime дата принятия/отклонения сертификата
 */
interface ICertificate {
  filePath: string;

  groupNumber: number;

  id: number;

  jiraLink: string;

  name: string;

  patronymic: string;

  score: number;

  creationTime: string;

  status: boolean | undefined;

  surname: string;

  taskName: string;

  isCertificateRead: boolean;

  approvalTime: string | undefined;
}

/**
 * Интерфейс данных сертификата, необходимых для смены статуса
 * @property {string} rejectReason причина отклонения сертификата
 * @property {number} score выставленная сертификату оценка
 * @property {boolean} status статус сертификата (принят/отклонен)
 */
interface INewCertificateStatus {
  rejectReason: string;

  score: number;

  status: boolean;
}
