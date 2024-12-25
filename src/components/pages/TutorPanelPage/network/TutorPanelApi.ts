import { BaseApi } from '@/components/common/network/base_api/BaseApi';

/**
 * Класс для работы с сетью в рамках ПУ Куратора
 * @extends {@link BaseApi}
 */
export class TutorPanelApi extends BaseApi {
  /** Метод получения информации о всех группах куратора */
  getGroupsDataByTutor = async (): Promise<IGroupData[]> => (
    await this.axiosInstance.get('/profile/group/by-tutor')
  ).data;

  /**
   * Метод получения последних действий конкретной группы по id
   * @param {number} id идентификатор
   * @param {number} page страница
   */
  getNotificationsByGroupId = async (id: number, page: number): Promise<IPagination<IGroupNotification>> => (
    await this.axiosInstance.get(`/profile/facts/by-group/${id}`, {
      params: { page },
    })
  ).data;

  /**
   * Метод для установки статуса "прочитано" для уведомления по id
   * @param {number} id идентификатор
   */
  setNotificationAsRead = async (id: number): Promise<void> => (
    await this.axiosInstance.patch(`/profile/facts/set-read/${id}`, true, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  ).data;

  /** Метод получения информации о митингах */
  getMeetingData = async (): Promise<IMeetingData[]> => (
    await this.axiosInstance.get(`/profile${this.path}/video-call/by-tutor`)
  ).data;

  /** Метод получения информации о кураторах */
  getTutorData = async (): Promise<IEmployeeTutorPanelData[]> => (
    await this.axiosInstance.get(`/profile${this.path}/employees/tutors`)
  ).data;

  /**
   * Метод обновления информации о митинге
   * @param {INewMeetingData} newData обновленные данные митинга
   */
  updateMeetingData = async (newData: INewMeetingData): Promise<IMeetingData[]> => (
    await this.axiosInstance.put(`/profile${this.path}/video-call/update-video-call`, newData)
  ).data;

  /**
   * Метод обновления статуса присутствия стажера на митинге
   * @param {IAttendanceStatus[]} newData обновленные данные стажера
   */
  updateTraineeAttendanceStatus = async (newData: IAttendanceStatus[]): Promise<void> => (
    await this.axiosInstance.put(`/profile${this.path}/video-call/attendance`, newData)
  );

  /** Метод получения информации об РСС-диалогах */
  getRssDialogData = async (): Promise<IRssDialogData[]> => (
    await this.axiosInstance.get('/profile/events/tutor-employees-rss')
  ).data;

  /**
   * Метод получения комментариев к РСС-диалогу по id
   * @param {number} eventId идентификатор РСС-диалога
   */
  getRssCommentsData = async (eventId: number): Promise<IRssCommentsData> => (
    await this.axiosInstance.get(`/profile/${this.path}/event/${eventId}`)
  ).data;

  /**
   * Метод обновления комментария куратора к РСС-диалогу
   * @param {INewRssDialogTutorComment} data новые данные РСС-диалога
   */
  editRssTutorComment = async (data: INewRssDialogTutorComment) => (
    await this.axiosInstance.put(`/profile/${this.path}/edit-tutor-comment`, data)
  );

  /**
   * Метод обновления даты РСС-диалога
   * @param {INewRssDialogDate} data новые данные РСС-диалога
   */
  changeRssDialogDate = async (data: INewRssDialogDate) => (
    await this.axiosInstance.put('/profile/events/assign-date', data)
  );

  /** Список причин */
  getAttendanceAbsenteeReasonList = async (): Promise<IAttendanceAbsenteeReason[]> => (
    await this.axiosInstance.get('/profile/absentee-reason')
  ).data;

  /** Посещения по неделе */
  getAttendanceWeekData = async (weekNumber: number): Promise<ITraineeAttendance[]> => (
    await this.axiosInstance.get(`/profile/${this.path}/week/${weekNumber}`)
  ).data;

  /** Изменить комментарий от куратора по посещению стажера */
  editAttendanceTutorComment = async (id: number, comment: string): Promise<void> => (
    await this.axiosInstance.patch(`/profile/${this.path}/${id}/edit-tutor-comment`, comment, {
      headers: {
        'Content-Type': comment === '' ? 'application/json' : 'text/plain'
      }
    })
  ).data;

  /** Изменить причину по посещению стажера */
  editAttendanceAbsenteeReason = async (id: number, absenteeReasonId: number): Promise<void> => (
    await this.axiosInstance.patch(`/profile/${this.path}/${id}/edit-absentee-reason`, absenteeReasonId, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  ).data;

  /** Метод получения внутренних встреч с участниками групп, закрепленными за куратором */
  getInternalMeetingDataByTutor = async (): Promise<IInternalMeetingData[]> => (
    await this.axiosInstance.get(`/profile${this.path}/tutor-employees-events`)
  ).data;

  /**
   * Метод получения детальной информации о внутренней встрече по id
   * @param {number} id идентификатор внутренней встречи
   */
  getInternalMeetingDetails = async (id: number): Promise<object> => (
    await this.axiosInstance.get(`/profile${this.path}/internal/${id}`)
  ).data;
}
