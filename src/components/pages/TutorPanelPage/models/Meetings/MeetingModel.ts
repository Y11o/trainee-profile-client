import { MeetingMemberModel } from '@/components/pages/TutorPanelPage/models/Meetings/MeetingMemberModel';

/**
 * Класс данных с информацией о митинге
 * @property {number | null} id идентификатор митинга
 * @property {number} groupNumber номер группы
 * @property {string} dateTime дата и время митинга
 * @property {string} videoCallStatus статус митинга
 * @property {string} departmentBranchName название департамента
 * @property {string} jiraLink ссылка на задачу в JIRA
 * @property {string} videoCallLink ссылка на митинг
 * @property {string} videoCallRecordLink ссылка на запись митинга
 * @property {string} description примечание куратора
 * @property {MeetingMemberModel[]} trainees список стажеров группы
 */
export class MeetingModel {
  constructor(json: IMeetingData) {
    this.id = json.id;
    this.groupNumber = json.groupNumber;
    this.dateTime = json.dateTime;
    this.videoCallStatus = json.videoCallStatus;
    this.departmentBranchName = json.departmentBranchName;
    this.jiraLink = json.jiraLink || 'Не указано';
    this.videoCallLink = json.videoCallLink || 'Не указано';
    this.videoCallRecordLink = json.videoCallRecordLink || 'Не указано';
    this.description = json.description;
    this.trainees = json.trainees ? json.trainees.map((e)=> new MeetingMemberModel(e)) : [];
  }

  id: number | null;

  groupNumber: number;

  dateTime: string;

  videoCallStatus: string;

  departmentBranchName: string;

  jiraLink: string;

  videoCallLink: string;

  videoCallRecordLink: string;

  description: string;

  trainees: MeetingMemberModel[];
}
