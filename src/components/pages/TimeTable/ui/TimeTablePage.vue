<template>
  <v-container
    class="fill-height page-color"
    fluid
  >
    <v-container
      class="page-block page-block-container h-100"
      fluid
    >
      <c-date-info
        v-if="!isDesktop"
        class="w-100 pb-1 mb-3"
        :chosen-date="calendarStore.date"
        :is-bordered-block="true"
        :events="eventsByCalendarDate"
      />
      <v-container
        class="w-100 d-flex flex-row px-0 py-0 mb-3 d-flex align-start ga-3"
        fluid
      >
        <c-media-container :class="isDesktop? 'px-5 pt-5 pb-6' : ''">
          <template #title>
            ПЛАН КОВОРКИНГА
          </template>
          <template #content>
            <c-time-table-plan/>
          </template>
        </c-media-container>
        <c-date-picker
          v-if="isDesktop"
          v-model="calendarStore.date"
          :hide-weekends="true"
          :events="eventsByCalendarDate"
        />
      </v-container>
      <c-media-container :class="isDesktop? 'px-5 py-5' : ''">
        <template
          v-if="!isDesktop"
          #title
        >
          <div class="w-100 d-flex justify-space-between align-center">
            <p>РАСПИСАНИЕ КОВОРКИНГА</p>
            <v-btn
              v-if="!isSmallWidthWindow"
              class="mx-2"
              text="Расписание стажёров"
              variant="outlined"
              density="comfortable"
              @click.stop="isEmployeeTimetableShown = true"
            />
          </div>
        </template>
        <template #content>
          <c-time-table
            :current-date="calendarStore.date"
            @show-employee-timetable="isEmployeeTimetableShown = true"
          />
        </template>
      </c-media-container>
      <v-btn
        v-if="isSmallWidthWindow"
        class="panel-btn"
        color="black"
        text="Расписание стажёров"
        variant="outlined"
        density="comfortable"
        elevation="2"
        block
        @click.stop="isEmployeeTimetableShown = true"
      />
    </v-container>
    <v-navigation-drawer
      :model-value="isEmployeeTimetableShown"
      width="450"
      location="right"
      temporary
      @update:model-value="isEmployeeTimetableShown = false;"
    >
      <employee-timetable-component
        :scheduleByUser="scheduleRequestsStore.scheduleByUser"
        @close-tab="isEmployeeTimetableShown = false"
      />
    </v-navigation-drawer>
  </v-container>
</template>

<script setup lang="ts">
import { inject, ref, onBeforeMount, watch, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import type { ComputedRef } from 'vue';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import { useCalendarStore } from '@/components/pages/MainPage/store/calendarStore';
import { useScheduleRequestsStore } from '@/components/pages/TimeTable/stores/scheduleRequestsStore';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import CTimeTable from '@/components/pages/TimeTable/ui/components/timetable/CTimeTable.vue';
import CDatePicker from '@/components/common/ui/CDatePicker/CDatePicker.vue';
import CDateInfo from '@/components/common/ui/CDateInfo.vue';
import CTimeTablePlan from '@/components/pages/TimeTable/ui/components/plan/CTimeTablePlan.vue';
import CMediaContainer from '@/components/common/ui/CMediaContainer.vue';
import EmployeeTimetableComponent from '@/components/pages/TimeTable/ui/components/timetable/EmployeeTimetableComponent.vue';

/** Экземпляр класса {@link useScheduleStore} */
const scheduleStore = useScheduleStore();

/** Экземпляр класса {@link useUserDataStore} */
const userDataStore = useUserDataStore();

/** Экземпляр класса {@link useScheduleRequestsStore} */
const scheduleRequestsStore = useScheduleRequestsStore();

/** Экземпляр класса {@link useEmployeeStore} */
const employeeStore = useEmployeeStore();

/** Экземпляр класса {@link useCalendarStore} */
const calendarStore = useCalendarStore();

/** Поле, отвечающее за адаптивность экрана (десктопное ли устройство) */
const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

const { width } = useWindowSize();

const isSmallWidthWindow = computed(() => width.value <= 500);

/** Переменная-флаг, отвечающая за показ/скрытие расписания стажеров */
const isEmployeeTimetableShown = ref<boolean>(false);

/** События на выбранную дату в календаре */
const eventsByCalendarDate = computed(() => employeeStore.calendarEventsByDate(calendarStore.date));

/** Получение интервалов, загрузки расписания, данных о стажере */
onBeforeMount(async () => {
  calendarStore.resetDate();

  if (userDataStore.isAuthorized) {
    employeeStore.getEmployeeData();
  }

  await scheduleRequestsStore.getIntervals();
  await scheduleRequestsStore.fetchScheduleData();
});

/** Метод получения данных расписания по выбранной дате */
const loadScheduleByDate = async (date: Date) => {
  scheduleStore.setDate(date);
  await scheduleRequestsStore.fetchScheduleData();
};

/** Отслеживание изменения даты и перезагрузка расписания */
watch(() => calendarStore.date, async () => await loadScheduleByDate(calendarStore.date));
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";

@media screen and (max-width: 1280px) {
  .page-block {
    align-content: flex-start
  }
}

.panel-btn {
  background-color: white;
  border: none;
  cursor: pointer;
  margin-top: 12px;
}
</style>
