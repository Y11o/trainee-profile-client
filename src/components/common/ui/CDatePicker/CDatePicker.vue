<template>
  <div
    class="bordered-block"
    :class="isVerticalVariant ? 'layout_vertical' : 'layout_horizontal'"
  >
    <div class="custom-calendar">
      <span class="custom-calendar__title"> КАЛЕНДАРЬ </span>
      <Calendar
        v-model="selectedDate"
        class="show-offset-dates"
        show-weeknumbers
        is-required
        borderless
        expanded
        :attributes="attrs"
        :locale="calendarLocale"
        :disabled-dates="hideWeekends ? [{ repeat: { weekdays: [1, 7] }}] : []"
      />
    </div>
    <v-divider v-if="isVerticalVariant"/>
    <c-date-info
      :events="events"
      :is-enable-expansion="isEnableExpansion"
      :chosen-date="selectedDate"
      :date-info-max-width="calendarMaxWidth"
      @change-layout="isVerticalVariant = !isVerticalVariant"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DatePicker as Calendar } from 'v-calendar';
import type { CalendarModel } from '@/components/pages/MainPage/models/calendar/CalendarModel';
import CDateInfo from '@/components/common/ui/CDateInfo.vue';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';

/**
 * @param {CalendarModel[]} events Массив событий, отображаемых в календаре
 * @param {boolean} isEnableExpansion Переменная, отвечающая за возможность сменить ориентацию календаря
 * @param {number} calendarMaxWidth Ширина экрана, при которой календарь переводится в вертикальную ориентацию и блокируется возможность смены ориентации
 * @param {boolean} hideWeekends Перменная, отвечающая за отключение выбора выходных дней
 */
const props = withDefaults(
  defineProps<{
    modelValue: Date,
    events: CalendarModel[],
    isEnableExpansion: boolean,
    calendarMaxWidth?: number,
    hideWeekends?: boolean,
  }>(),
  {
    modelValue: () => new Date(),
    events: () => [],
    isEnableExpansion: false,
    calendarMaxWidth: 676,
    hideWeekends: false,
  },
);

const emit = defineEmits(['update:modelValue']);

/**
 * Поле, отвечающее за горизонтальную/вертикальную ориентацию календаря
 */
const isVerticalVariant = ref<boolean>(true);

/**
 * Поле выбранной в календаре даты
 */
const selectedDate = ref<Date>(props.modelValue);

/**
 * Отслеживание и присваивание выбранной даты из dateSelect
 */
watch(() => useScheduleStore().date, (newDate) => selectedDate.value = newDate);

/**
 * Настройки локализации календаря
 */
const calendarLocale = {
  id: 'ru',
  masks: {
    weekdays: 'WW'
  }
};

/**
 * Параметры внешнего вида календаря
 */
const attrs = ref<object[]>([
  {
    key: 'today',
    highlight: {
      fillMode: 'outline'
    },
    dates: new Date(),
  }
]);

/**
 * Отслеживание изменений в выбранной дате и эмит выбранной даты
 */
watch(selectedDate, () => emit('update:modelValue', selectedDate.value));

/**
 * Отслеживание ширины экрана и изменения параметра isVerticalVariant на true, если размер менее calendarMaxWidth
 */
window.matchMedia(`(max-width: ${props.calendarMaxWidth}px)`).addEventListener('change', () => isVerticalVariant.value = true);
</script>

<style scoped lang="scss">
@import '@/styles/colorVars.scss';

.custom-calendar__title {
  font-size: 14px;
  font-weight: 500;
  line-height: 18px;
}

.layout_horizontal,
.layout_vertical {
  width: fit-content;
}

.layout_horizontal {
  height: 378px;
  display: flex;

  .custom-calendar {
    width: 360px;
    margin: 7.2px 0;
  }
}

.layout_vertical {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 400px;
  height: 440px;
}

.custom-calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 7.2px 0;

  & :deep(.vc-light) {
    --vc-weekday-color: $lk-black;
    --vc-weeknumber-color: #0987FC; //тут почему-то не работают переменные
    --vc-header-title-color: #0987FC; //тут почему-то не работают переменные
  }

  & :deep(.highlight-today) {
    background: $lk-blue;
  }

  & :deep(.vc-highlight-content-solid) {
     color: $lk-white;
  }

  & :deep(.vc-header) {
    border-bottom: 1px solid $lk-gb-40;
  }

  & :deep(.show-offset-dates) {
    &.vc-monthly .is-not-in-month * {
      opacity: 0.5;
    }
  }
}

.layout_horizontal .custom-calendar {
  & :deep(.vc-weekdays) {
    padding-bottom: 10px;
    padding-top: 10px;
  }

  & :deep(.vc-week:not(:last-child)) {
    padding-bottom: 10px;
  }
}

@media (max-width: 400px) {
  .layout_vertical {
    width: auto;
  }
}
</style>
