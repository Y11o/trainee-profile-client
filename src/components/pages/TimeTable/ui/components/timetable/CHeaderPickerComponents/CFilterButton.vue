<template>
  <v-badge
    class="badge-width"
    color="#0987FC"
    :content="filterCount"
  >
    <v-btn
      class="px-2 w-100"
      text="Фильтры"
      borderColor="#0987FC"
      @click="useScheduleStore().setIsFilterModalShown(true)"
    />
  </v-badge>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';

/**
 * Экземпляр класса {@link useScheduleStore}
 */
const scheduleStore = useScheduleStore();

/**
 * Вычисление количества выбранных фильтров
 */
const filterCount = computed(() => scheduleStore.filtersCount);
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

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
</style>
