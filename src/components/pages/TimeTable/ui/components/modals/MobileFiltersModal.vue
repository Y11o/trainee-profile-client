<template>
  <v-card
    class="d-flex flex-column overflow-auto"
    max-width="500"
    min-height="400"
    max-height="600"
  >
    <c-modal-header @close-icon-clicked="clearData">
      <template #header>
        <div class="w-100 d-flex align-center">
          <div
            class="btn--clear position-absolute cursor-pointer"
            @click="clearData"
          >
            Очистить
          </div>
          <div class="w-100 d-flex justify-center">
            <h3>Фильтры</h3>
          </div>
        </div>
      </template>
    </c-modal-header>
    <div class="ma-3 d-flex flex-column ga-3">
      <div class="d-flex ga-4">
        <c-date-select :hide-weekends="true"/>
        <c-time-select/>
        <c-table-select/>
      </div>
      <v-btn
        class="w-100"
        text="Показать только свободные столы"
        variant="outlined"
        :class="isFreeTableButtonClicked ? 'controls--pressed' : 'controls'"
        @click="setFreeTables"
      />
      <c-student-name-select v-model="selectedStudentNames"/>
    </div>
    <v-card-actions class="mt-auto">
      <v-btn
        class="w-100 controls"
        text="Применить"
        variant="outlined"
        @click="applyFilters"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';
import CTimeSelect from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CTimeSelect.vue';
import CDateSelect from '@/components/common/ui/CDatePicker/CDateSelect.vue';
import CTableSelect
  from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CTableSelect.vue';
import CStudentNameSelect
  from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CStudentNameSelect.vue';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';

/**
 * Экземпляр класса {@link useScheduleStore}
 */
const scheduleStore = useScheduleStore();

const emit = defineEmits(['closeModal']);

/**
 * Поле, отвечающее за переключение отображения свободных/всех столов
 */
const isFreeTableButtonClicked = ref<boolean>(scheduleStore.isFreeTables);

/**
 * Переменная, хранящая количество выбранных фильтров
 */
const filterCount = ref<number>(0);

/**
 * Переменная, хранящая выбранных сотрудников
 */
const selectedStudentNames = computed(() => scheduleStore.selectedEmployees);

/**
 * Метод, отвечающий за установку свободных столов
 */
const setFreeTables = () => {
  isFreeTableButtonClicked.value = !isFreeTableButtonClicked.value;
  scheduleStore.setFreeTablesValue(isFreeTableButtonClicked.value);
};

/**
 * Метод очистки выбранных фильтров
 */
const clearData = () => {
  scheduleStore.setFreeTablesValue(false);
  scheduleStore.setEmployees([]);
  scheduleStore.setFiltersCount(filterCount.value);
  emit('closeModal');
};

/**
 * Метод, отвечающий за применение выбранных фильтров
 */
const applyFilters = () => {
  if (isFreeTableButtonClicked.value) {
    filterCount.value += 1;
  }
  if (selectedStudentNames.value.length != 0) {
    filterCount.value += 1;
  }
  scheduleStore.setFiltersCount(filterCount.value);
  emit('closeModal');
};
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.controls {
  width: 100%;
  height: 36px;
  background: $lk-gr-background;
  border: 1px solid $lk-gr-border;

  &--pressed {
    background: $lk-white;
    color: $lk-blue;
    border: 1px solid $lk-blue;
  }
}

.btn--clear {
  color: $lk-blue;
}
</style>
