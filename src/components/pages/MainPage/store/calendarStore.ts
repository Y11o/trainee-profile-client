import { defineStore } from 'pinia';

export const useCalendarStore = defineStore('calendarStore', {
  state: () => ({
    date: new Date()
  }),
  actions: {
    resetDate() {
      this.date = new Date();
    }
  }
});
