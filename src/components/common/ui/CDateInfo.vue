<template>
  <div :class="isBorderedBlock ? 'bordered-block' : ''">
    <div :class="isHorizontalVariant ? 'events_horizontal' :'events_vertical'">
      <div
        class="date-info"
        :class="isHorizontalVariant ? '' : 'pa-2'"
      >
        <v-icon
          v-if="isEnableExpansion"
          class="control-expansion"
          size="small"
          :class="isHorizontalVariant ? '' : 'ma-2'"
          :icon="isHorizontalVariant ? 'mdi-arrow-expand' : 'mdi-arrow-collapse'"
          @click="onChangeLayout"
        />
        <div class="d-flex flex-column align-center justify-center font-weight-medium">
          <span class="date-info__day"> {{ getDayFromDate }} </span>
          <span class="date-info__month"> {{ getMonthFromDate }} </span>
          <span class="date-info__year"> {{ getYearFromDate }} </span>
          <span class="date-info__week"> {{ getWeekFromDate }} НЕДЕЛЯ </span>
        </div>
      </div>
      <v-divider
        :inset="isHorizontalVariant"
        :vertical="isHorizontalVariant"
      />
      <div
        class="date-events d-flex flex-column gr-3 text-body-2 justify-center"
        :class="isHorizontalVariant ? 'w-100' : ''"
      >
        <template v-if="events.length">
          <span
            v-for="event in events"
            :key="event.id"
            class="date-events__text"
          >
            <span class="font-weight-medium">{{ extractTime(event.dateTime) }}</span>
            {{ event.title }}<template v-if="event.cabinet">, каб. {{ event.cabinet }}</template>
          </span>
        </template>
        <template v-else>
          <span v-if="chosenDate.toLocaleDateString('ru') === new Date().toLocaleDateString('ru')">
            На сегодня мероприятий нет.
          </span>
          <span v-else>
            На {{ chosenDate.toLocaleDateString('ru') }} мероприятий нет.
          </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Day, FirstWeekContainsDate, getWeek } from 'date-fns';
import type { CalendarModel } from '@/components/pages/MainPage/models/calendar/CalendarModel';

/**
 * @param {CalendarModel[]} [events = []] события, отображаемые в календаре
 * @param {boolean} [isEnableExpansion = false] переменная-флаг, отвечающая за возможность расширения календаря
 * @param {boolean} [isBorderedBlock = false] переменная-флаг, отвечающая за наличие/отсутствие границы у календаря
 * @param {Date} chosenDate выбранная дата
 * @param {number} [dateInfoMaxWidth = 676] минимальная ширина экрана, при которой допускается расширение календаря
 */
const props = withDefaults(
  defineProps<{
    events: CalendarModel[];
    isEnableExpansion?: boolean;
    isBorderedBlock?: boolean;
    chosenDate?: Date;
    dateInfoMaxWidth?: number
  }>(),
  {
    events: () => [],
    isEnableExpansion: false,
    isBorderedBlock: false,
    chosenDate: () => new Date(),
    dateInfoMaxWidth: 676
  },
);

const emit = defineEmits(['changeLayout']);

/**
 * Переменная-флаг, отвечающая за ориентацию виджета
 */
const isHorizontalVariant = ref<boolean>(true);

/**
 * Опции для метода {@link chosenDate.toLocaleDateString}
 */
const options: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

/**
 *  Опции для метода {@link getWeek}
 */
const weekSettings: { weekStartsOn: Day; firstWeekContainsDate: FirstWeekContainsDate } = {
  weekStartsOn: 1,
  firstWeekContainsDate: 1,
};

/**
 * Текущий день, полученный из даты
 */
const getDayFromDate = computed(() => props.chosenDate.getDate());

/**
 * Текущий месяц, полученный из даты
 */
const getMonthFromDate = computed(() => props.chosenDate.toLocaleDateString('ru-RU', options).split(' ')[2].toUpperCase());

/**
 * Текущий год, полученный из даты
 */
const getYearFromDate = computed(() => props.chosenDate.getFullYear());

/**
 * Номер текущей недели, полученный из даты
 */
const getWeekFromDate = computed(() => getWeek(props.chosenDate, weekSettings));

/**
 * Метод изменения ориентации виджета. Меняет значение {@link isHorizontalVariant} на противоположное и эмитит событие 'changeLayout'
 */
const onChangeLayout = () => {
  isHorizontalVariant.value = !isHorizontalVariant.value;
  emit('changeLayout');
};

/**
 * Метод преобразования исходной строки с датой и времением в строку времени в формате "чч:мм"
 * @param {String} stringDate исходная строка с датой и временем
 * @returns время в формате "чч:мм"
 */
const extractTime = (stringDate: string): string => {
  const date = new Date(stringDate);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Отслеживание изменения размера экрана, при превышении заданного значения {@link dateInfoMaxWidth} устанавливает {@link isHorizontalVariant} в true
 */
window.matchMedia(`(max-width: ${props.dateInfoMaxWidth}px)`).addEventListener('change', () => isHorizontalVariant.value = true);
</script>

<style scoped lang="scss">
@import '@/styles/colorVars.scss';

.date-info {
  position: relative;
  min-width: 100px;
}

.control-expansion {
  color: $lk-gr;
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
}

.date-info__day {
  font-size: 50px;
  line-height: 50px;
}

.date-info__month {
  font-size: 14px;
}

.date-info__year {
  font-size: 14px;
}

.date-info__week {
  font-size: 12px;
  color: $lk-gr;
}

.date-events__text {
  font-size: 14px;
  line-height: 16px;
}

.events_vertical {
  width: 314px;
  height: 378px;
  border-left: 2px solid $lk-gb-40;

  .date-events {
    height: 220px;
    margin: 12px 8px 12px 20px;
    overflow: auto;
  }
}

.events_horizontal {
  height: 120px;
  display: flex;
  margin: 8px;
  gap: 10px;

  .date-events {
    margin: 8px 0;
    overflow: auto;
  }
}

@media (max-width: 676px) {
  .control-expansion {
    display: none;
  }
}
</style>
