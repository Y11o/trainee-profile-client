<template>
  <div class="time-table__header">
    <div
      v-if="isDesktop"
      class="text-subtitle-2 font-weight-medium text-left mb-3 d-flex justify-space-between"
    >
      <p>РАСПИСАНИЕ КОВОРКИНГА</p>
      <v-btn
        text="Расписание стажёров"
        variant="outlined"
        density="comfortable"
        @click="emit('showEmployeeTimetable')"
      />
    </div>
  </div>
  <v-data-table-virtual
    class="time-table"
    height="360"
    :headers="(headers as any)"
    :items="filteredSchedule"
    :fixed-header="true"
    :mobile="false"
  >
    <template #headers>
      <c-header-picker
        :headers="headers"
        :current-date="currentDate"
      />
    </template>
    <template #item="{ item }: { item: IScheduleDisplayInterface }">
      <tr>
        <td>
          <span style="font-weight: 600">{{ item.date.toLocaleDateString('ru') }}</span>
        </td>
        <td>
          <span>{{ formatDisplayedTimeRange(item.startTime, item.finishTime) }}</span>
        </td>
        <td>
          <span
            v-if="isDesktop"
            class="truncate-text"
          >
            {{ getDeskName(item.desk.name) }} {{ ` (Каб. ${item.cabinet})` }}
          </span>
          <span
            v-else
            class="truncate-text"
          >
            {{ getDeskName(item.desk.name) }}
          </span>
        </td>
        <td>
          <span
            class="table-data"
            :class="item.bookingStatus === 'FREE' ? 'table-data--empty' : 'table-data--reserved'"
            @click="openReservationModal(item)"
          >
            {{ item.bookingStatus === 'FREE' ? 'забронировать' : item.user?.fullName }}
          </span>
        </td>
      </tr>
    </template>
    <template #no-data>
      <v-alert
        class="transparent-alert"
        type="info"
        :value="true"
      >
        {{ isWeekend ? `Сегодня ${ currentWeekDay } - выходной день` : 'Ничего не найдено'}}
      </v-alert>
    </template>
  </v-data-table-virtual>
  <c-modal-window
    :modelValue="isModalShow"
    title="Бронирование места"
    dialogWidth="400px"
    confirmBtnText="ЗАБРОНИРОВАТЬ"
    cancelBtnText="ОЧИСТИТЬ"
    :hasControls="true"
    :stayOnConfirmBtnClick="false"
    @update:modelValue="isModalShow = $event"
    @confirmAction="addReservation"
    @onCloseModal="scheduleStore.toggleModalShow()"
  >
    <template #content>
      <c-reservation-modal
        :desk="selectedTable!"
        :interval="interval"
        :isModalWindow="isModalShow"
        @update:selectedRegularInterval="selectRegularInterval"
      />
    </template>
  </c-modal-window>
  <v-overlay
    v-model="isFiltersModalShow"
    class="d-flex justify-center align-center"
    persistent
  >
    <mobile-filters-modal @close-modal="useScheduleStore().setIsFilterModalShown(false)"/>
  </v-overlay>
</template>

<script setup lang="ts">
import { inject, ref, onBeforeMount, computed, onMounted } from 'vue';
import type { ComputedRef } from 'vue';
import type {
  IScheduleDisplayInterface,
  IEmployeesListItemInterface,
  IDesk,
  IHeaderPickerInterface
} from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { formatDisplayedTimeRange } from '@/lib/utils';
import ScheduleData from '@/components/pages/TimeTable/model/default_data.json';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';
import { useScheduleRequestsStore } from '@/components/pages/TimeTable/stores/scheduleRequestsStore';
import { useUserDataStore } from '@/components/pages/MainPage/store/userDataStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import router from '@/router';
import CHeaderPicker from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPicker.vue';
import CReservationModal from '@/components/pages/TimeTable/ui/components/modals/CReservationModal.vue';
import CModalWindow from '@/components/common/ui/widgets/ui/modals/CModalWindow.vue';
import MobileFiltersModal from '@/components/pages/TimeTable/ui/components/modals/MobileFiltersModal.vue';
import CDateSelect from '@/components/common/ui/CDatePicker/CDateSelect.vue';
import CTimeSelect from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CTimeSelect.vue';
import CTableSelect from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CTableSelect.vue';
import CFilterButton from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CFilterButton.vue';
import CFreeTableCheckbox from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CFreeTableCheckbox.vue';
import CStudentNameSelect from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CStudentNameSelect.vue';

/**
 * Поле, отвечающее за адаптивность экрана (десктопное ли устройство)
 */
const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

/**
 * @param {Date} currentDate Переменная, хранящая выбранную дату
 */
withDefaults(
  defineProps<{
    currentDate: Date
  }>(),
  {
    currentDate: () => new Date(),
  }
);

const emit = defineEmits(['showEmployeeTimetable']);

/**
 * Экземпляр класса {@link useScheduleStore}
 */
const scheduleStore = useScheduleStore();

/**
 * Экземпляр класса {@link useScheduleRequestsStore}
 */
const scheduleRequestsStore = useScheduleRequestsStore();

/**
 * Поле, отвечающее за открытие/скрытие модального окна
 */
const isModalShow = ref<boolean>(false);

/**
 * Переменная, хранящая значение выбранного стола из списка
 */
const selectedTable = ref<IDesk | null>(null);

/**
 * Переменная, хранящая значение интервала для передачи в компонент выбора времени
 */
const interval = ref<{id: number}>({id: 0});

const selectedRegularInterval = ref<number>();

const selectRegularInterval = (intervalId: number) => selectedRegularInterval.value = intervalId;

/**
 * Computed-свойство, содержащее текущий день недели
 */
const currentWeekDay = computed(() => scheduleStore.date.toLocaleDateString('ru-RU', { weekday: 'long' }));

/**
 * Computed-свойство, определяющее, является ли текущий день недели выходным
 */
const isWeekend = computed(() => currentWeekDay.value === 'суббота' || currentWeekDay.value === 'воскресенье');

/**
 * Отфильтрованный массив данных расписания
 */
const filteredSchedule = computed(() => !isWeekend.value ? scheduleStore.filteredSchedule() as IScheduleDisplayInterface[] : []);

/**
 * Поле, отвечающее за открытие/скрытие окна фильтров
 */
const isFiltersModalShow = computed(() => scheduleStore.isFilterModalShown);

onBeforeMount(async () => await reserveDesk());

onMounted(async () => {
  const reservationDataId = JSON.parse(sessionStorage.getItem('reservationDataId')!);

  if (reservationDataId) {
    const reservationData = filteredSchedule.value.filter((item: any) => item.id == reservationDataId);
    await openReservationModal(reservationData[0]);
    sessionStorage.removeItem('reservationDataId');
  }
});

/**
 * Метод передачи данных из таблицы расписания в окно бронирования
 */
const openReservationModal = async (intervalItem: IScheduleDisplayInterface): Promise<void> => {

  if (isDataActual(intervalItem.startTime) && intervalItem.bookingStatus === 'FREE') {

      selectedTable.value = {
        id: intervalItem.desk.id,
        name: intervalItem.desk.name
      };

      const scheduleByTable = scheduleRequestsStore.scheduleData.filter(
        (item: IScheduleDisplayInterface) => item.desk.id === intervalItem.desk.id && !item.user
      );
      scheduleStore.getFreeTimeRangesByTable(scheduleByTable);

      interval.value = {
        id: scheduleByTable.findIndex((item: IScheduleDisplayInterface) => item.id === intervalItem.id) + 1
      };

      isModalShow.value = true;
      scheduleStore.toggleModalShow();

      if (!useUserDataStore().isAuthorized) {
        const reservationDataId = JSON.stringify(intervalItem.id);
        sessionStorage.setItem('reservationDataId', reservationDataId);
      }
  }
};

const reserveDesk = async () => {
  const data = ScheduleData.users as IEmployeesListItemInterface[];
  scheduleStore.setEmployeesData(data);
};

/**
 * Метод для брони стола
 */
const addReservation = async () => {
  if (useUserDataStore().isAuthorized) {
    await scheduleRequestsStore.fetchReservation(selectedTable.value!);
    if (selectedRegularInterval.value) {
      await scheduleRequestsStore.deleteUserInterval(selectedRegularInterval.value);
    }
    scheduleStore.toggleModalShow();
  } else {
    const { redirect, ...query } = router.currentRoute.value.query;
    localStorage.setItem('reservationQuery', JSON.stringify(query));

    
    scheduleStore.toggleModalShow();

    useSnackbarStore().openSnackbar('Для добавления брони необходимо авторизоваться.', {
      icon: 'error'
    });

    router.push({
      path: typeof redirect === 'string' ? redirect : '/',
      query: {redirect: '/sched'}
    });
  }
};

/**
 * Метод форматирования отображения названия стола в таблице
 */
const getDeskName = (desk: string): string =>
  (desk === 'Стол ассистента 1' || desk === 'Стол ассистента 2' || desk === 'NO NAME') ? `${desk}` : `№${desk}`;

/**
 * Поле, отвечающее за контроль над актуальностью данных
 */
const isDataActual = (dateTime: Date): boolean => new Date() < dateTime;

/**
 * Настройка содержимого шапки таблицы расписания
 */
const headers = [
  { title: 'date', value: 'date', align: 'start', componentFullScreen: CDateSelect, component: CDateSelect },
  { title: 'time', value: 'time', align: 'start', componentFullScreen: CTimeSelect, component: CTimeSelect },
  { title: 'table', value: 'table',  componentFullScreen: CTableSelect, component: CFilterButton, align: 'end' },
  { title: 'reservation', value: 'reservation', componentFullScreen: CFreeTableCheckbox, align: 'end' },
  { title: 'selectName', value: 'selectName', componentFullScreen: CStudentNameSelect }
] as IHeaderPickerInterface[];
</script>

<style lang="scss">
@import "@/styles/colorVars.scss";

.time-table__header {
  border-bottom: 1px solid $lk-gb-40;
}

.time-table {
  @media (width >= 1280px) {
    padding-left: 20px;
    padding-right: 20px;
  }

  tbody > tr:not(:first-child) > td {
    padding: 8px !important;
    border-bottom: none !important; // FIXME: зависит от окончательного решения аналитика/дизайнера
  }
}

.time-table.v-table--density-default {
  --v-table-header-height: 50px !important;
  --v-table-row-height: 30px !important;
}

.table-data {
  cursor: pointer;

  &--reserved {
    color: $lk-black;
  }

  &--empty {
    color: $lk-green;
  }
}
</style>
