<template>
  <v-container
    class="time-select time-select__container mr-0 ml-0 px-2 py-0 d-flex flex-nowrap align-center"
    @change="scheduleStore.setTimeRange(startTimeSelested?.time, finishTimeSelested?.time)"
  >
    <v-icon
      v-if="isDesktop"
      class="mr-1"
      icon="mdi-clock-time-three-outline"
      color="grey-darken-2"
    />
    <v-container
      fluid
      class="px-0 py-0 d-flex flex-row nowrap"
    >
      <select
        v-model="startTimeSelested"
        class="range-select pl-1 pr-0"
      >
        <option
          v-for="startTime in startTimeRules"
          :key="startTime.id"
          :value="startTime"
        >
          {{ startTime.time }}
        </option>
      </select>
      <span class="text-style--bold text-style--colored">-</span>
      <select
        v-model="finishTimeSelested"
        class="range-select pl-0 pr-1"
      >
        <option
          v-for="finishTime in finishTimeRules"
          :key="finishTime.id"
          :value="finishTime"
        >
          {{ finishTime.time }}
        </option>
      </select>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { computed, inject, nextTick, onBeforeMount, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import { formatTimeRequest } from '@/lib/utils';
import type { ITimeRange } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';

/**
 * Поле, отвечающее за адаптивность экрана (десктопное ли устройство)
 */
const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

/**
 * @param {boolean} isModalWindow Поле, отвечающее за открытие/скрытие модального окна
 * @param {id: number} interval Переменная, хранящая идентификатор выбранного интервала
 */  
const props = defineProps<{
  isModalWindow: boolean,
  interval: {
    id: number
  }
}>();

/**
 * Экземпляр класса {@link useScheduleStore}
 */
const scheduleStore = useScheduleStore();

/**
 * Переменная, хранящая время начала интервала, выбранное пользователем
 */
const startTimeSelested = ref<ITimeRange | null | undefined>(null);

/**
 * Переменная, хранящая время окончания интервала, выбранное пользователем
 */
const finishTimeSelested = ref<ITimeRange | null>(null);

/**
 * Вычисление свободных интервалов для начального времени и/или всех доступных вариантов начального времени
 */
const startTimeRules = computed(() => {
  let timeSlots: ITimeRange[] =  [];

  if (scheduleStore.isModalShow) {
    let slotId = 1;
    let intervalIndex = 0;

    scheduleStore.timeRanges.forEach(({ startTime, finishTime }) => {
      intervalIndex++;

      let currentTime = new Date(startTime);
      const endTime = new Date(finishTime);

      while (currentTime < endTime) {
        timeSlots.push({
          id: slotId++,
          time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rangeIndex: intervalIndex
        });
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    });

    return timeSlots;
  } else {
    let timeSlots: ITimeRange[] =  [];

    let currentTime = new Date().setHours(8, 0, 0, 0);
    const endTime = new Date().setHours(21, 30, 0, 0);

    while (currentTime <= endTime) {
      timeSlots.push({
        id: Date.now(),
        time: new Date(currentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      currentTime += 30 * 60 * 1000;
    }

    return timeSlots;
  }
});

/**
 * Вычисление свободных интервалов для конечного времени и/или всех доступных вариантов конечного времени
 */
const finishTimeRules = computed(() => {
  let timeSlots: ITimeRange[] =  [];

  if (scheduleStore.isModalShow) {
    let slotId = 1;
    let intervalIndex = 0;

    scheduleStore.timeRanges.forEach(({ startTime, finishTime }) => {
      intervalIndex++;
      const endTime = new Date(finishTime);
      let currentTime =  new Date(new Date(startTime).getTime() + 30 * 60 * 1000);

      while (currentTime <= endTime) {
        timeSlots.push({
          id: slotId++,
          time: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          rangeIndex: intervalIndex
        });
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }
    });

    const selectedIndex = startTimeSelested.value?.rangeIndex;

    return timeSlots.filter(item => item.rangeIndex === selectedIndex);
  } else {
    let currentTime = new Date((new Date()).toLocaleDateString('en') + ' ' + startTimeSelested.value?.time).getTime();
    const endTime = new Date().setHours(22, 0, 0, 0);

    while (currentTime <= endTime) {
      timeSlots.push({
        id: Date.now(),
        time: new Date(currentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      currentTime += 30 * 60 * 1000;
    }

    return timeSlots.slice(1);
  }
});

/**
 * Инициализация начального, конечного времени и расчет доступных интервалов
 */
onBeforeMount(() => {
  if (!scheduleStore.isModalShow) {
    startTimeSelested.value = startTimeRules.value[0];
      finishTimeSelested.value =  finishTimeRules.value[finishTimeRules.value.length - 1];
      scheduleStore.setTimeRange(startTimeSelested.value?.time, finishTimeSelested.value?.time);
  } else {
    startTimeSelested.value =  startTimeRules.value.find((item: ITimeRange) => item.rangeIndex === props.interval.id);
    nextTick(() => {
     finishTimeSelested.value =  finishTimeRules.value.findLast((item: ITimeRange) => item.rangeIndex === props.interval.id);
     scheduleStore.setTimeRange(startTimeSelested.value?.time, finishTimeSelested.value?.time);
    });
  }
});

/**
 * Отслеживание изменений времени в зависимости от начального времени и установка соответствующих интервалов
 */
watch(startTimeSelested, (newValue) => {
  let selectedIndex: number | undefined;

  if (scheduleStore.isModalShow) {
    selectedIndex = newValue?.rangeIndex;
    finishTimeSelested.value = finishTimeRules.value.findLast((item: ITimeRange) => item.rangeIndex === selectedIndex);
    scheduleStore.setTimeRange(startTimeSelested.value?.time, finishTimeSelested.value?.time);
  } else {
    nextTick(() => {
      finishTimeSelested.value = finishTimeRules.value[finishTimeRules.value.length - 1];
      scheduleStore.setTimeRange(startTimeSelested.value?.time, finishTimeSelested.value?.time);
    });
  }

  const selectedStartTime: Date = formatTimeRequest(newValue?.time);
  const selectedFinishTime: Date = formatTimeRequest(finishTimeSelested.value?.time);

  if (selectedStartTime >= selectedFinishTime) {
    finishTimeSelested.value = { ...finishTimeRules.value[0] };
  }
});

/**
 * Отслеживание изменений времени в случае открытия модального окна бронирования
 */
watch(() => scheduleStore.isModalShow, () => {
  nextTick(() => {
    startTimeSelested.value = startTimeRules.value[0];
    finishTimeSelested.value =  finishTimeRules.value[finishTimeRules.value.length - 1];
    scheduleStore.setTimeRange(startTimeSelested.value?.time, finishTimeSelested.value?.time);
  });
});
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.time-select {
  &__container {
    background-color: $lk-gr-background;
    border: 1px solid $lk-gb-40;
    border-radius: 4px;
    width: fit-content;
    height: 32px;
  }

  & :deep(.vc-bordered) {
    border: none !important;
  }

  & :deep(.vc-time-picker) {
    padding: 0;
  }

  & :deep(.vc-base-select) {
    padding: 0px 0px;

    & select {
      font-size: 14px;
      color: $lk-blue;
      font-weight: 400;
    }
  }

  & :deep(.vc-base-icon) {
    display: none;
  }

  & :deep(.vc-time-select-group) {
    border: none;
    padding: 0px 0px !important;
    background-color: $lk-gr-background;

    & select {
      padding: 1px 0px 0px 1px;
    }
  }

  & :deep(.vc-time-colon) {
    margin: 0;
    @extend.text-style--colored;
  }
}

.text-style {
  &--bold {
    font-weight: 500;
  }

  &--colored {
    color: $lk-blue;
  }
}

.range-select {
  color: $lk-blue;
}
</style>
