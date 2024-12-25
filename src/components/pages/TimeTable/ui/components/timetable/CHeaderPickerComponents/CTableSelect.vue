<template>
  <div class="d-inline-flex align-center select-table px-2">
    <span class="text-color">Стол:</span>
    <div class="vc-base-select">
      <select
        v-model="selectedDesk"
        class="vc-time-select-hours vc-focus vc-align-right"
        @change="scheduleStore.setDeskNumber(selectedDesk)"
      >
        <option 
          v-for="table in TablesData.tables" 
          :value="table" 
          :key="table"
        >
          {{ table }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';
import TablesData from '@/components/pages/TimeTable/model/tables_data.json';

/**
 * Экземпляр класса {@link useScheduleStore}
 */
const scheduleStore = useScheduleStore();

/**
 * Переменная, хранящая значение выбранного стола
 */
const selectedDesk = ref<string>('-');
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.vc-base-select select {
  font-size: 14px;
  color: $lk-blue;
  padding: 0 4px;
}

.select-table {
  background-color: $lk-gr-background;
  border-radius: var(--vc-rounded-md);
  border: 1px solid $lk-gb-40;
  height: 32px;
}

.text-color {
  color: $lk-gr;
}

.select-box {
  & :deep(.v-input__details) {
    display: none !important;
  }

  & :deep(.v-field) {
    border: 1px solid #fff;
    min-width: none;
    font-size: 14px;
  }
}
</style>
