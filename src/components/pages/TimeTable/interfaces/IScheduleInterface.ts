import type { Component } from 'vue';

export interface IScheduleInterface {
  id: number,
  bookingStatus: bookingStatus,
  desk: {
    cabinet: object,
    id: number,
    number: string
  },
  finishTime: string,
  startTime: string,
  user: IUserInterface | null,
  visitStatus: object
}

export interface IScheduleDisplayInterface {
  id: number,
  user: IUserInterface | null,
  date: Date,
  startTime: Date,
  finishTime: Date,
  cabinet: string,
  desk: IDesk,
  bookingStatus: string;
}

interface bookingStatus {
  id: number,
  name: string
}

export interface IRequestTimeRange {
  id: number,
  startTime: Date,
  finishTime: Date
}

export interface IUserInterface {
  id: number,
  name: string,
  patronymic: string,
  surname: string,
  role: object,
  fullName: string,
  shortName: string
}

export interface IRegularScheduleInterface {
  id: number,
  dayOfWeek: string,
  desk: {
    cabinet: object,
    id: number,
    number: string
  },
  startTime: string,
  finishTime: string,
  weekIsEven: boolean | null,
  rusDayOfWeek?: string
}

export interface IEmployeesListItemInterface {
  id: number,
  intervals: IScheduleInterface[],
  name: string,
  surname: string,
  patronymic: string,
  regularSchedules: IRegularScheduleInterface[],
  role: object
}

export interface IHeaderPickerInterface {
  title: string, 
  value: string, 
  align: string, 
  componentFullScreen: Component, 
  component: Component 
}

export interface IDesk {
  id: number,
  name: string
}

export interface IReservationData {
  startTime: string,
  finishTime: string,
  desk: {
    id: number,
  },
  user: {
    id: number[] | null,
  },
  bookingStatus: {
    id: number,
  }
}

export interface IReservationModalInterface {
  intervalId: number,
  requestTimeRange: IRequestTimeRange,
  desk?: IDesk
}

export interface ITimeRange {
  id: number;
  time: string;
  rangeIndex?: number
}

export interface IUserSchedule {
  intervals: IScheduleDisplayInterface[],
  regularSchedules: IRegularScheduleInterface[]
}