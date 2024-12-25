import { BaseApi } from '@/components/common/network/base_api/BaseApi';
import type { IEmployeeData, IReportedTask } from '@/components/pages/MainPage/interfaces/MainPageInterfaces';

export class EmployeeApi extends BaseApi {
  /**
   * Метод получения всех данных о стажере - его информации, мероприятии в календаре и задачи в треке развития
   */
  getTraineeData = async (): Promise<IEmployeeData> => (
    await this.axiosInstance.get(`/profile${this.path}/data`)
  ).data;

  /**
   * Метод получения всех доступных заданий и курсов, которые можно взять в работу
   */
  getAvailableTasks = async (): Promise<ITasksCourses> => (
    await this.axiosInstance.get('/profile/tasks/courses-practices')
  ).data;

  /**
   * Метод получения всех стажеров
   */
  getAllEmployees = async (): Promise<EmployeeData[]> => (
    await this.axiosInstance.get(`/profile${this.path}/details-data`)
  ).data;

  /**
   * Метод взятия практичесого задания в работу
   * @param data информация о задании
   */
  addTask = async (data: object): Promise<void> => (
    await this.axiosInstance.post('/profile/employee-tasks/create', data)
  );

  /**
   * Метод загрузки новой фотографии профиля
   * @param data фото
   */
  uploadPhoto = async (data: FormData): Promise<void> =>
    await this.axiosInstance.post(`/profile${this.path}/upload-avatar`, data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });

  /**
   * Метод получения фотографии профиля
   */
  loadProfileImage = async (): Promise<any> => (
    await this.axiosInstance.get('/profile/employees/avatar', {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'blob'
    })).data;

  /**
   * Метод завершения работы над курсом
   * @param {FormData} data сертификат о завершении задания
   */
  completeCourse = async (data: FormData): Promise<void> =>
    await this.axiosInstance.post('/profile/employee-tasks/attach-file', data, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  });

  /**
   * Метод завершения работы над заданием
   * @param {number} userID ID пользователя
   * @param {number} taskID ID задачи
   */
  completeTask = async (userID: number, taskID: number) =>
    await this.axiosInstance.patch(`/profile/employee-tasks/close-task?employeeId=${userID}&taskId=${taskID}`);

  /** Метод получения даты последней отправки еженедельного отчета */
  getLastWeeklyReportDate = async (): Promise<{ lastTimeReported: string }> => (
    await this.axiosInstance.get('/profile/employee-tasks/last-time-reported-employee')
  ).data;

  /**
   * Метод отправления еженедельного отчета по часам, затраченным на выполнение заданий из трека развития
   * @param {IReportedTask[]} data массив заданий, для которых отправляется отчет
   */
  sendWeeklyReport = async (data: IReportedTask[]): Promise<void> => (
    await this.axiosInstance.patch('/profile/employee-tasks/weekly-report', data)
  );
}
