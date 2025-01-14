<template>
  <v-container class="px-0 py-0">
    <span class="d-block w-100 py-2 px-2 justify-start mb-4 reservation-data">
      Бронирование стола {{ formattedDeskName(desk.name, desk.id) }}
    </span>
    <c-student-name-select
      :isMultiple="false"
      :isModalWindow="true"
      :isMySchedule="true"
      :isTrainee="true"
      class="mb-4"
    />
    <v-container
      class="d-flex align-center justify-space-between row px-0 py-0 ga-4 mb-4"
      fluid
    >
      <c-date-select
        :isDisablePicker="true"
        :isModalWindow="true"
      />
      <c-time-select
        :isModalWindow="isModalWindow"
        :interval="interval"
      />
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import type { IDesk } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { useScheduleRequestsStore } from '@/components/pages/TimeTable/stores/scheduleRequestsStore';
import { useUserDataStore } from '@/components/pages/MainPage/store/userDataStore';
import CDateSelect from '@/components/common/ui/CDatePicker/CDateSelect.vue';
import CTimeSelect from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CTimeSelect.vue';
import CStudentNameSelect from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CStudentNameSelect.vue';

/**
 * @param {IDesk} currentDate Переменная, хранящая выбранную дату
 * @param {id: number} interval Переменная, хранящая идентификатор выбранного интервала
 * @param {boolean} isModalWindow Поле, отвечающее за открытие/скрытие модального окна
 */
defineProps<{
  desk: IDesk,
  interval: {
    id: number
  },
  isModalWindow: boolean,
}>();

const emit = defineEmits(['update:selectedRegularInterval']);

/**
 * Поле, отвечающее за отображение элементов выбора отработки пропуска
 */
const isWorkingOff = ref<boolean>(false);

/**
 * Настройка вариантов отработок 
 */
const workingOffVariants = ref<string[]>(['Отработка пропуска', 'Добавить отработку заранее']);

/**
 * Переменная, хранящая выбранный вариант отработки пропуска
 */
const selectedWorkingOff = ref<string | null>(null);

/**
 * Переменная, хранящая выбранный интервал, который необходимо отработать
 */
const selectedRegularInterval = ref<number | null>(null);

const userIntervals = ref(useScheduleRequestsStore().scheduleByUser);

const formattedIntervals = computed(() => userIntervals.value.regularSchedules.map((interval) => ({
  id: interval.id,
  formattedInterval: `${formatWeekday(interval.dayOfWeek)} (${formatWeekType(interval.weekIsEven)}): ${interval.startTime}-${interval.finishTime} (${interval.desk.number})`
})));

watch(isWorkingOff, (newValue) => {
  if (!newValue) {
    selectedRegularInterval.value = null;
  }
});
/**
 * Инициализация установленного значения варианта пропуска 
 */
onMounted(() => selectedWorkingOff.value = workingOffVariants.value[0]);

const handleSelectChange = (interval: number) => {
  emit('update:selectedRegularInterval', interval);
};

watch(selectedRegularInterval, (newValue: number) => {
  emit('update:selectedRegularInterval', newValue);
});

/**
 * Настройка отображения названия стола
 */
const formattedDeskName = (deskName: string, deskId: number): string => {
  switch (deskName) {
    case 'АССИСТЕНТ':
      if (deskId === '32') {
        return 'ассистента 1';
      } else if (deskId === '44') {
        return 'ассистента 2';
      }
      break;
    case 'Стол ассистента 2':
      return 'ассистента 2';
    case 'Стол ассистента 1':
      return 'ассистента 1';
    case 'NO NAME':
    case 'NONAME':
      return `${deskName}`;
    default:
      return `№${deskName}`;
  }
};

const formatWeekday = (day: string): string => {
  switch (day) {
    case 'MONDAY':
      return 'ПН';
    case 'TUESDAY':
      return 'ВТ';
    case 'WEDNESDAY':
      return 'СР';
    case 'THURSDAY':
      return 'ЧТ';
    case 'FRIDAY':
      return 'ПТ';
    case 'SATURDAY':
      return 'СБ';
    case 'SUNDAY':
      return 'ВС';
    default:
      return day;
  }
};

const formatWeekType = (weekIsEven: boolean): string => weekIsEven ? 'чет' : 'нечет';
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

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

.checkbox {
  :deep(.v-selection-control__input) {
    justify-content: start;
  }

  :deep(.v-selection-control--density-default) {
    --v-selection-control-size: 30px;
  }
}

.select {
  &:deep(.v-select__selection-text) {
    margin-left: 20px;
  }
}

</style>
