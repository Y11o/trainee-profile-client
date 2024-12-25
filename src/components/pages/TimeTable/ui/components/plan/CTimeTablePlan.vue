<template>
  <v-container
    v-if="isDesktop"
    class="d-flex flex-row px-0 py-0 justify-space-around ga-4">
    <v-container
      v-for="item in TableData.tablePlanParameters"
      :key="item.value"
      class="px-0 py-0">
      <div class="text-subtitle-2 font-weight-medium text-left mb-1 text-grey">
        {{ item.title }}
      </div>
      <c-grid-layout
        :rowHeight="18"
        :layout="item.layout"
        :col="item.col"
      />
    </v-container>
  </v-container>
  <v-tabs
    v-else
    v-model="selectedTab"
    bg-color="none"
    height="32px"
    :items="TableData.tablePlanParameters"
  >
    <template #tab="{ item }">
      <v-tab
        :text="item.title"
        :value="item.value"
      />
    </template>
    <template #item="{ item }">
      <v-tabs-window-item :value="item.value">
        <c-grid-layout
          :rowHeight="30"
          :layout="item.layout"
          :col="item.col"
        />
      </v-tabs-window-item>
    </template>
  </v-tabs>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue';
import type { ComputedRef } from 'vue';
import { useTableDataStore } from '@/components/pages/TimeTable/stores/tableDataStore';
import CGridLayout from '@/components/pages/TimeTable/ui/components/plan/layout/CGridLayout.vue';

/**
 * Поле, отвечающее за адаптивность экрана (десктопное ли устройство)
 */
const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

/**
 * Экземпляр класса {@link useTableDataStore}
 */
const TableData = useTableDataStore();

/**
 * Переменная, хранящая номер выбранного таба
 */
const selectedTab = ref<number>(0);
</script>

<style lang="scss">
@import "@/styles/colorVars.scss";

.v-tab-item--selected {
  color: $lk-blue;
}
</style>
