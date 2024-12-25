<template>
  <v-menu
    activator="parent"
    location="bottom"
    transition="fade-transition"
  >
    <div class="modal__header px-2 d-flex align-center">
      <div class="text-subtitle-2 font-weight-medium">СТОЛ {{ formattedDeskName(desk.name) }}</div>
    </div>
    <span
      v-if="currentWeekDay === 'суббота' || currentWeekDay === 'воскресенье'"
      class="border-t-0 modal__text pa-2 elevation-7"
    >
      Сегодня {{ currentWeekDay }} - выходной день
    </span>
    <v-list
      v-else
      class="px-0 py-0"
      min-width="280"
      max-height="250"
      slim
      overflow-auto
    >
      <v-list-item
        v-for="item in scheduleDataByTable"
        :key="item.id"
        class="px-2 py-0"
        overflow-auto
        height="30px"
      >
        <v-row no-gutters>
          <v-col cols="4">
            <span>{{ formatDisplayedTimeRange(item.startTime, item.finishTime) }}</span>
          </v-col>
          <v-col>
            <span
              :class="item.bookingStatus === 'FREE' ? 'table-data--empty' :  'table-data--reserved'"
              @click.stop="openReservationModal(item.id, item.bookingStatus)"
            >
              {{ item.bookingStatus === 'FREE' ?  'забронировать' : item.user?.fullName }}
            </span>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-menu>
  <c-modal-window
    :modelValue="isModalShow"
    title="Бронирование места "
    dialogWidth="400px"
    confirmBtnText="ЗАБРОНИРОВАТЬ"
    cancelBtnText="ОЧИСТИТЬ"
    :hasControls="true"
    :stayOnConfirmBtnClick="false"
    @update:modelValue="isModalShow = $event"
    @confirmAction="addReservation"
    @onCloseModal="closeModal"
  >
    <template #content>
      <c-reservation-modal
        :desk="desk"
        :interval="interval"
        :isModalWindow="isModalWindow"
        @update:selectedRegularInterval="selectRegularInterval"
      />
    </template>
  </c-modal-window>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { IDesk, IScheduleDisplayInterface} from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';
import { useUserDataStore } from '@/components/pages/MainPage/store/userDataStore';
import { useScheduleRequestsStore } from '@/components/pages/TimeTable/stores/scheduleRequestsStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { formatDisplayedTimeRange } from '@/lib/utils';
import router from '@/router';
import CReservationModal from '@/components/pages/TimeTable/ui/components/modals/CReservationModal.vue';
import CModalWindow from '@/components/common/ui/widgets/ui/modals/CModalWindow.vue';

/**
 * Экземпляр класса {@link useScheduleStore}
 */
const scheduleStore = useScheduleStore();

/**
 * Экземпляр класса {@link useScheduleRequestsStore}
 */
const scheduleRequestsStore = useScheduleRequestsStore();

/**
 * @param {IScheduleDisplayInterface[]} scheduleDataByTable Переменная, хранящая данные о расписания по выбранному столу
 * @param {IDesk} desk Переменная, хранящая выбранный стол
 */
const props = defineProps<{
  scheduleDataByTable: IScheduleDisplayInterface[],
  desk: IDesk
}>();

/**
 * Поле, отвечающее за открытие/скрытие модального окна
 */
const isModalShow = ref<boolean>(false);

const selectedRegularInterval = ref<number>();

const selectRegularInterval = (intervalId: number) => selectedRegularInterval.value = intervalId;

/**
 * Переменная, хранящая идентификатор выбранного интервала
 */
let interval = ref<{id: number}>({id: 0});

const isModalWindow = ref<boolean>(true);

/**
 * Computed-свойство, содержащее текущий день недели
 */
const currentWeekDay = computed(() => scheduleStore.date.toLocaleDateString('ru-RU', { weekday: 'long' }));

/**
 * Метод добавления брони
 */
const addReservation = async () => {
  if (useUserDataStore().isAuthorized) {
    await scheduleRequestsStore.fetchReservation(props.desk);
    if (selectedRegularInterval.value) {
      await scheduleRequestsStore.deleteUserInterval(selectedRegularInterval.value);
    }
  } else {
    const { redirect, ...query } = router.currentRoute.value.query;
    localStorage.setItem('reservationQuery', JSON.stringify(query));

    useSnackbarStore().openSnackbar('Для добавления брони необходимо авторизоваться.', {
      icon: 'error'
    });

    router.push({
      path: typeof redirect === 'string' ? redirect : '/',
      query: {redirect: '/sched'}
    });
  }
  closeModal();
};

/**
 * Метод скрытия модального окна
 */
const closeModal = () => {
  scheduleStore.toggleModalShow();
  isModalWindow.value = false;
};

/**
 * Метод открытия модального окна
 */
const openReservationModal = (intervalId: number, bookingStatus: string): void => {
  if (bookingStatus === 'FREE') {
    const freeIntervals = props.scheduleDataByTable.filter(item => !item.user);
    scheduleStore.toggleModalShow();
    isModalShow.value = true;
    interval.value = {
      id: freeIntervals.findIndex(item => item.id === intervalId) + 1
    };
  }
};

/**
 * Настройка отображения названия стола
 */
const formattedDeskName = (deskName: string): string => {
  switch (deskName) {
    case 'АССИСТЕНТ':
      return `${deskName}A`;
    case 'NONAME':
      return 'NO NAME';
    default:
      return `№${deskName}`;
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.modal__text {
  background-color: $lk-white;
  border: 1px solid $lk-gb-40;
  border-radius: 0 0 8px 8px;
}

.modal__header {
  background-color: $lk-gr-background;
  height: 32px;
  border: 1px solid $lk-gb-40;
  border-radius: 8px 8px 0 0;
}

span {
  font-size: 14px;
}

.reservation-data {
  background-color: $lk-gr-background;
  border-radius: 4px;
}

.v-btn {
  font-size: 12px;
  font-weight: 400;
  color: $lk-blue;

  &.v-btn--density-default {
    height: 32px;
    border: 1px solid $lk-gb-40;
    margin: auto;
  }
}

.badge-width {
  max-width: 100px;
}

.table-data {

  &--reserved {
    color: $lk-black;
  }

  &--empty {
    color: $lk-green;
    cursor: pointer;
  }
}
</style>
