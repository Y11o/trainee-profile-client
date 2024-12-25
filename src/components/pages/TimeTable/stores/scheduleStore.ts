import { defineStore } from 'pinia';
import {type IScheduleDisplayInterface, type IEmployeesListItemInterface, type IDesk, type IReservationData, type IRequestTimeRange } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { formatDateTimeRequest, formatTimeRequest, replaceDate } from '@/lib/utils';
import { useScheduleRequestsStore } from './scheduleRequestsStore';
import type { CalendarModel } from '../../MainPage/models/calendar/CalendarModel';

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    date: new Date() as Date,
    employees: [] as IEmployeesListItemInterface[],
    isFreeTables: false as boolean,
    selectedDesk: null as null | string,
    selectedEmployees: [] as number[] | number,
    selectedEmployee: [] as number[] | number,
    isResultModalShow: false as boolean,
    finishTime: new Date(),
    startTime: new Date(),
    requestTimeRange: {} as object,
    timeRanges: [] as IRequestTimeRange[],
    isModalShow: false,
    allEmployees: [] as IEmployeesListItemInterface[],
    currentUserId: null as null | number,
    events: [] as object[],
    filtersCount: 0 as number,
    isFilterModalShown: false,
    workingOffDate: new Date(),

    scheduleRequestsStore: useScheduleRequestsStore()
  }),
  actions: {
    setDate(date: Date) {
      this.date = date;
    },
    setWorkingOffDate(date: Date) {
      this.workingOffDate = date;
    },
    setAllEmployees(employees: IEmployeesListItemInterface[]) { // FIXME: убрать: когда будет готова авторизация для расписания
      this.allEmployees = employees;
    },
    setCurrentUser(user: object) {
      this.currentUserId = user.id; // FIXME: убрать: когда будет готова авторизация для расписания
    },
    setScheduleByUser(events: CalendarModel[]) {
      this.events = events; // FIXME: убрать: когда будет готова авторизация для расписания
    },
    setEmployeesData(employees: IEmployeesListItemInterface[]) {
      this.employees = employees;
    },
    setFreeTablesValue(isFreeTables: boolean) {
      this.isFreeTables = isFreeTables;
    },
    setDeskNumber(selectedDesk: string) {
      this.selectedDesk = selectedDesk;
    },
    setEmployees(selectedEmployees: number[]) {
      this.selectedEmployees = selectedEmployees;
    },
    setEmployee(selectedEmployee: number[] | number) {
      this.selectedEmployee = selectedEmployee;
    },
    setTimeRange(startTime: string | null | undefined, finishTime: string | null | undefined) {
      this.startTime = formatTimeRequest(startTime);
      this.finishTime = formatTimeRequest(finishTime);
    },
    setFiltersCount(filtersCount: number) {
      this.filtersCount = filtersCount;
    },
    setIsFilterModalShown(isFilterModalShown: boolean) {
      this.isFilterModalShown = isFilterModalShown;
    },
    reservationData(desk: IDesk): IReservationData {
      return ({
        startTime: formatDateTimeRequest(this.startTime, this.date),
        finishTime: formatDateTimeRequest(this.finishTime, this.date),
        desk: {
          id: desk.id,
        },
        user: {
          id: this.selectedEmployee,
        },
        bookingStatus: {
          id: 3,
        }
      });
    },
    getFreeTimeRangesByTable(timeRanges: IScheduleDisplayInterface[]) {
      this.timeRanges = timeRanges.map((interval: IRequestTimeRange) => ({
        id: interval.id,
        startTime: interval.startTime,
        finishTime: interval.finishTime
      }));
    },
    toggleModalShow() {
      this.isModalShow = !this.isModalShow;
    },
    filteredSchedule() {
      let filteredSchedule: IScheduleDisplayInterface[] = this.scheduleRequestsStore.scheduleData;
      if (!this.isModalShow) {
        filteredSchedule = this.filteredByTableAvailability(filteredSchedule);
        filteredSchedule = this.filteredByDeskNumber(filteredSchedule);
        filteredSchedule = this.filteredByEmployee(filteredSchedule);
        filteredSchedule = this.filteredByTimeRange(filteredSchedule);
      }
      return filteredSchedule;
    },
    filteredByTableAvailability(schedule: IScheduleDisplayInterface[]) {
      if (this.isFreeTables) {
        return schedule.filter((item) => item.bookingStatus === 'FREE');
      } else {
        return schedule;
      }
    },
    filteredByTimeRange(schedule: IScheduleDisplayInterface[]) {
      // if (!this.isModalShow) {
        const filteredSchedule = schedule.filter((item) => {
          const startTime = replaceDate(item.startTime);
          const finishTime = replaceDate(item.finishTime);
          return startTime.getTime() >= this.startTime!.getTime() && finishTime.getTime() <= this.finishTime!.getTime();
        });
        return filteredSchedule;
      // }
    },
    filteredByDeskNumber(schedule: IScheduleDisplayInterface[]) {
      if (this.selectedDesk === '-' || !this.selectedDesk) {
        return schedule;
      }
      return schedule.filter((item) => item.desk.name === this.selectedDesk);
    },
    filteredByEmployee(schedule: IScheduleDisplayInterface[]) {
      if (this.selectedEmployees.length === 0) {
        return schedule;
      }
      return schedule.filter(item => item.user && this.selectedEmployees.includes(item.user.id));
    }
  }
});

