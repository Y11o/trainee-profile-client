import { defineStore } from 'pinia';
import type { IUserSchedule, IEmployeesListItemInterface, IRegularScheduleInterface, IScheduleDisplayInterface, IScheduleInterface, IDesk } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { ScheduleApi, NoAuthScheduleApi } from '@/components/pages/TimeTable/network/ScheduleApi';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { ScheduleModel } from '@/components/pages/TimeTable/model/ScheduleModel';
import { UserScheduleModel } from '../model/UserScheduleModel';

export const useScheduleRequestsStore: any = defineStore('scheduleRequests', {
  state: () => ({
    scheduleApi: new ScheduleApi('/schedule'),
    noAuthScheduleApi: new NoAuthScheduleApi('/schedule'), // FIXME: убрать после создания авторизации для расписания
    scheduleStore: useScheduleStore(),
    snackbarStore: useSnackbarStore(),

    freeScheduleIntervals: [] as IScheduleDisplayInterface[],
    scheduleData: [] as IScheduleDisplayInterface[],
    scheduleByUser: {} as IUserSchedule,
    scheduleDataByTable: [] as IScheduleDisplayInterface[]
  }),
  actions: {
    async fetchReservation(desk: IDesk): Promise<void> {
      this.scheduleApi.addReservation(this.scheduleStore.reservationData(desk))
        .then(() => {
          this.fetchScheduleData();
          this.loadScheduleByTable(Number(desk.id));
          if (this.scheduleStore.currentUserId) {
            this.fetchScheduleDataByUser(this.scheduleStore.selectedEmployee);
          }
        })
        .catch(() => this.snackbarStore.openSnackbar('Произошла ошибка при бронировании стола. Повторите попытку.',
          { icon: 'error' })
        );
    },
    async fetchScheduleData(): Promise<void> {
      const date = this.scheduleStore.date.toISOString().split('T')[0];

      try {
        const [regularScheduleResult, freeScheduleResult] = await Promise.all([
          this.noAuthScheduleApi.getScheduleByDate({ date: date }),
          this.noAuthScheduleApi.getFreeScheduleByDate({ date: date })
        ]);

        const regularScheduleData =
          regularScheduleResult.map((item: IScheduleInterface) => new ScheduleModel(item));

        const freeScheduleData =
          freeScheduleResult.map((item: IScheduleInterface) => new ScheduleModel(item));

        this.freeScheduleIntervals = regularScheduleData;
        this.scheduleData = [...regularScheduleData, ...freeScheduleData];
      } catch (e) {
        this.snackbarStore.openSnackbar('Не удалось загрузить расписание. Обновите страницу.',
          { icon: 'error' }
        );
        console.error(e);
      }
    },
    async loadScheduleByTable(deskId: number): Promise<void> {
      const date = this.scheduleStore.date.toISOString().split('T')[0];
      const desk = {
        id: deskId
      };

      try {
        const [regularScheduleResult, freeScheduleResult] = await Promise.all([
          this.noAuthScheduleApi.getScheduleByDateAndDesk({ date: date, desk: desk }),
          this.noAuthScheduleApi.getFreeScheduleByDateAndDesk({ date: date, desk: desk })
        ]);

        const regularScheduleData =
          regularScheduleResult.map((item: IScheduleInterface) => new ScheduleModel(item));

        const freeScheduleData =
          freeScheduleResult.map((item: IScheduleInterface) => new ScheduleModel(item));

        this.scheduleStore.getFreeTimeRangesByTable(freeScheduleData);

        this.scheduleDataByTable = [...regularScheduleData, ...freeScheduleData];
      } catch (e) {
        this.snackbarStore.openSnackbar('Не удалось загрузить расписание для стола. Повторите попытку.',
          { icon: 'error' }
        );
      }
    },
    async fetchScheduleDataByUser(userId: number | number[]) {
      this.noAuthScheduleApi.getUserSchedule(userId)
        .then((result: IUserSchedule) => {
          this.scheduleByUser.intervals =
            result.intervals.map((item: IScheduleDisplayInterface) => new ScheduleModel(item)) as IScheduleDisplayInterface[];
          this.scheduleByUser.regularSchedules =
            result.regularSchedules.map((item: IRegularScheduleInterface) => new UserScheduleModel(item)) as IRegularScheduleInterface[];
        })
        .catch(() => this.snackbarStore.openSnackbar('Не удалось загрузить расписание. Обновите страницу.',
          { icon: 'error' })
        );
    },
    async deleteUserInterval(intervalId: number) {
      this.scheduleApi.deleteUserInterval(intervalId) // FIXME: заменить на id авторизованного пользователя
        .then(() => {
          this.fetchScheduleData();

          const selectedUser = this.scheduleStore.currentUserId
            ? this.scheduleStore.currentUserId
            : this.scheduleStore.allEmployees[0].id;
          this.fetchScheduleDataByUser(selectedUser);
        })
        .catch((e) => {
          // FIXME: обработать ошибку
          console.error(e);
        });
    },
    async loadEmployeeNames(): Promise<void> {
      try {
        const result: IEmployeesListItemInterface[] = await this.noAuthScheduleApi.getEmployeeNames();
        this.scheduleStore.setAllEmployees(result);
        await this.getUserId();
      } catch (error) {
        this.snackbarStore.openSnackbar('Не удалось загрузить данные о сотрудниках. Обновите страницу.',
          { icon: 'error' }
        );
      }
    },
    async getUserId(): Promise<void> {
      const currentUser = localStorage.getItem('user');
      const user = this.scheduleStore.allEmployees.find(
        (user: IEmployeesListItemInterface): boolean => `${user.surname} ${user.name} ${user.patronymic}` === currentUser
      );
      if (user) {
        this.scheduleStore.setCurrentUser(user);
      }
    },
    async getIntervals(): Promise<void> {
      this.noAuthScheduleApi.getIntervals()
        .then(() => {
           // FIXME: убрать, когда появится авторизация расписания
        })
        .catch(() => this.snackbarStore.openSnackbar('Ошибка загрузки данных. Повторите попытку.'));
      }
    }
});
