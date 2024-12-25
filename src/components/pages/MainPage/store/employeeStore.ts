import { defineStore } from 'pinia';
import { EmployeeApi } from '@/components/pages/MainPage/network/EmployeeApi';
import { EmployeeDataModel } from '@/components/pages/MainPage/models/EmployeeDataModel';

export const useEmployeeStore = defineStore('employeeDataStore', {
  state: () => ({
    /**
    * @property {EmployeeDataModel | null} employeeData Данные о стажере
    */
    employeeData: null as EmployeeDataModel | null,

    /**
    * @property {boolean} isDataReceived Статус получения данных с сервера
    */
    isDataReceived: false,
  }),
  getters: {
    /**
    * @property {EmployeeApi} employeeApi Класс с методами для связи прогресс-трека с сервером
    */
    employeeApi: () => new EmployeeApi('/employees'),

    /**
    * @property {ProgressTrackerModel[]} calendarEventsByDate Задачи, отфильтрованные по дате
    */
    calendarEventsByDate: (state) => 
      (date: Date) => state.employeeData
        ? state.employeeData.calendarEvents
          .filter((event) => new Date(event.dateTime).toLocaleDateString('ru-Ru') === date.toLocaleDateString('ru-Ru'))
        : []
  },
  actions: {
    async getEmployeeData() {
      this.isDataReceived = false;

      return this.employeeApi.getTraineeData()
        .then((response) => {
          this.employeeData = new EmployeeDataModel(response);
        })
        .finally(() => this.isDataReceived = true);
    }
  }
});
