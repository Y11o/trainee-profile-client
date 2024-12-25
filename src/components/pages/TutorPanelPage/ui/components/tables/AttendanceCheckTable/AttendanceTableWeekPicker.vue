<template>
  <div class="colors-gray">
    <v-menu
      v-model="isDatePickerVisible"
      location="bottom"
      eager
      :transition="false"
      :close-on-content-click="false"
    >
      <template #activator="{ props }">
        <div class="w-100">
          <v-btn
            class="week-picker-btn opacity-100 colors-blue pl-1 pr-0"
            variant="plain"
            density="compact"
            v-bind="props"
            :ripple="false"
          >
            <template #prepend>
              <v-icon
                class="colors-gray"
                icon="mdi-calendar-range-outline"
              />
            </template>
            <span>НЕДЕЛЯ №{{ selectedWeekData.weekNumber }}</span>
          </v-btn>
        </div>
      </template>
      <v-card
        variant="flat"
        elevation="4"
        rounded="lg"
      >
        <date-picker
          ref="datePickerElement"
          v-model="weekDatePicker"
          :max-date="datePickerMaxDate"
          :disabled-dates="disabledDates"
          :attributes="highlightedSelectedWeekDateRange"
        />
      </v-card>
    </v-menu>
    <div class="d-flex ga-1">
      <v-icon
        class="cursor-pointer"
        icon="mdi-arrow-left-thick"
        size="18"
        :disabled="isDisabledPrevWeek"
        @click="setPrevWeek"
      />
      <span>
        {{ formatDate(selectedWeekData.startDate) }} — {{ formatDate(selectedWeekData.finishDate) }}
      </span>
      <v-icon
        icon="mdi-arrow-right-thick"
        size="18"
        :disabled="isDisabledNextWeek"
        @click="setNextWeek"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue';
import { DatePicker } from 'v-calendar';
import {
  format,
  startOfISOWeek,
  setISOWeek,
  endOfISOWeek,
  getISOWeek,
  getYear,
  getMonth,
} from 'date-fns';
import { useRouter } from 'vue-router';

const emit = defineEmits(['selectWeek']);

const router = useRouter();

const isDatePickerVisible = ref<boolean>(false);

const datePickerElement = ref<HTMLDivElement>();

const weekDatePicker = ref<Date>(new Date());

const selectedWeekNumber = ref<number>(
  Number(router.currentRoute.value.query.week) || getISOWeek(weekDatePicker.value)
);

/** Вычисление диапазона дат выбранной недели */
const selectedWeekData = computed(() => ({
  weekNumber: selectedWeekNumber.value,
  startDate: startOfISOWeek(setISOWeek(new Date(), selectedWeekNumber.value)),
  finishDate: endOfISOWeek(setISOWeek(new Date(), selectedWeekNumber.value)),
}));

const isDisabledNextWeek = computed(() =>
  (selectedWeekNumber.value === getISOWeek(new Date())) || selectedWeekNumber.value === 52);

const isDisabledPrevWeek = computed(() => selectedWeekNumber.value === 1);

const disabledDates = computed(() => [{ repeat: { weekdays: [1, 7] } }]);

const datePickerMaxDate = computed(() => endOfISOWeek(new Date()));

const highlightedSelectedWeekDateRange = computed(() => [{
  highlight: {
    start: { fillMode: 'outline' },
    base: { fillMode: 'light' },
    end: { fillMode: 'outline' },
  },
  dates: {
    start: selectedWeekData.value.startDate,
    end: selectedWeekData.value.finishDate,
  },
}]);

watch(selectedWeekNumber, () => updateSelectWeek());

watch(weekDatePicker, () => isDatePickerVisible.value = false);

/** Установка номера недели в зависимости от выбранной даты */
watch(weekDatePicker, () => selectedWeekNumber.value = getISOWeek(weekDatePicker.value));

/** Передвижение текущего месяца при выборе недели, относящейся к данному месяцу */
watch(selectedWeekNumber, () => moveToMonth((getMonth(selectedWeekData.value.startDate) + 1)));

onBeforeMount(() => updateSelectWeek());

const moveToMonth = async (month: number) =>
  await (datePickerElement.value as any).move({ month, year: getYear(weekDatePicker.value) });

const setPrevWeek = () => selectedWeekNumber.value--;

const setNextWeek = () => selectedWeekNumber.value++;

const updateSelectWeek = () => emit('selectWeek', selectedWeekNumber.value);

const formatDate = (date: Date) => format(date, 'dd.MM.yyyy');
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

.week-picker-btn {
  opacity: 1;

  :deep(.v-btn__prepend) {
    margin-right: 3px;
  }
}

.colors {
  &-blue {
    color: $lk-blue;
  }

  &-gray {
    color: $lk-gr;
  }
}

:deep(.v-overlay__content) {
  top: 200px !important;
}
</style>
