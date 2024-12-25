<template>
  <v-icon
    icon="mdi-calendar-range-outline"
    class="d-flex d-lg-none cursor-pointer"
    @click="isCalendarOpened = !isCalendarOpened"
  />
  <v-overlay
    v-model="isCalendarOpened"
    class="align-center justify-center"
  >
    <c-date-picker
      v-model="calendarStore.date"
      :events="eventsByCalendarDate"
      :is-enable-expansion="true"
    />
  </v-overlay>
  <c-notifications-menu/>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCalendarStore } from '@/components/pages/MainPage/store/calendarStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import CDatePicker from '@/components/common/ui/CDatePicker/CDatePicker.vue';
import CNotificationsMenu from '@/components/common/ui/CNavBar/CNotificationsMenu.vue';

const employeeStore = useEmployeeStore();
const calendarStore = useCalendarStore();

/** Переменная-флаг, отвечающая за показ/скрытие календаря */
const isCalendarOpened = ref<boolean>(false);

/** События на выбранную дату в календаре */
const eventsByCalendarDate = computed(() => employeeStore.calendarEventsByDate(calendarStore.date));

/** Отслеживание размеров экрана, при большей ширине, чем установленная, отключает возможность показа календаря */
window.matchMedia('(min-width: 1280px)').addEventListener('change', () => isCalendarOpened.value = false);
</script>
