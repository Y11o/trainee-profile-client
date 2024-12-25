<template>
  <date-select
    v-model="date"
    :popover="false"
    :disabled-dates="hideWeekends ? [{ repeat: { weekdays: [1, 7] }}] : []"
    @click="changeDate(date)"
  >
    <template #default="{ inputValue, togglePopover }">
      <div class="date-picker rounded d-inline-flex px-2 py-1 align-item-center border-sm">
        <v-icon
          v-if="isDesktop"
          class="mr-1"
          icon="mdi-calendar-range-outline"
          color="grey-darken-2"
          :disabled="isDisablePicker"
          @click="togglePopover"
        />
        <input
          :value="inputValue"
          class="date-picker__input"
          :disabled="isDisablePicker"
          @click="togglePopover"
        />
      </div>
    </template>
  </date-select>
</template>

<script setup lang="ts">
import { inject, ref, onBeforeMount, watch } from 'vue';
import { DatePicker as DateSelect } from 'v-calendar';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';

/**
 * Поле, отвечающее за адаптивность экрана (десктопное ли устройство)
 */
const isDesktop = inject<boolean>('isDesktop');

/**
 * @param {boolean} isDisablePicker Переменная, отвечающая за активность/неактивность виджета
 * @param {boolean} isModalWindow Перменная, отвечающая за способ отображения компонента - в виде виджета или модального окна
 * @param {Date} currentDate Выбранная дата в родительском компоненте
 * @param {boolean} hideWeekends Перменная, отвечающая за отключение выбора выходных дней
 */
 const props = withDefaults(
  defineProps<{
    isDisablePicker?: boolean,
    isModalWindow?: boolean;
    currentDate: Date,
    isWorkingOff?: boolean
    hideWeekends?: boolean,
  }>(),
  {
    isDisablePicker: false,
    isModalWindow: false,
    currentDate: () => new Date(),
    hideWeekends: false,
  }
);

const changeDate = (date: Date): void => !props.isWorkingOff ? scheduleStore.setDate(date) :  scheduleStore.setWorkingOffDate(date);

/**
 * Экземпляр класса {@link useScheduleStore}
 */
const scheduleStore = useScheduleStore();

/**
 * Переменная, отвечающая за выбор даты в date-select
 */
const date = ref<Date>(new Date());

/**
 * Отслеживание currentDate из пропсов и установка его значения в date
 */
watch(() => props.currentDate, () => date.value = props.currentDate);

/**
 * Инициализация полей времени и установка дат в хранилище
 */
onBeforeMount(async () => {
  if (!props.isWorkingOff) {
    if (props.isModalWindow) {
      date.value = scheduleStore.date;
    } else {
      scheduleStore.setDate(date.value);
    }
  } else {
    scheduleStore.setWorkingOffDate(date.value);
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";

.date-picker {
  height: 32px;
  background-color: $lk-gr-background;
  border: 1px solid $lk-gb-40;

  &__input {
    width: 70px;
    color: $lk-blue;
    font-weight: 500;
    line-height: 32px;
    font-size: 14px;
  }
}
</style>
