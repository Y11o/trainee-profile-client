<template>
  <grid-item
    v-for="item in layout"
    :key="item.id"
    :x="item.x"
    :y="item.y"
    :w="item.w"
    :h="item.h"
    :i="item.i"
    :class="{ 'grid-item--disabled': item.disabled, 'grid-item--vertical-text': item.verticalText, 'grid-item--clickable': !item.disabled }"
    @click="scheduleRequestsStore.loadScheduleByTable(item.id)"
  >
    <span
      class="d-flex w-100 h-100 justify-center align-center text text--rotate"
      :style="isDesktop ? 'font-size: 9px' : 'font-size: 13px'"
    >
      {{ item.i }}
    </span>
    <c-reservation-by-table-modal
      :schedule-data-by-table="scheduleRequestsStore.scheduleDataByTable"
      :desk="{id: item.id, name: item.i }"
    />
  </grid-item>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ComputedRef } from 'vue';
import { useScheduleRequestsStore } from '@/components/pages/TimeTable/stores/scheduleRequestsStore';
import { GridItem } from 'grid-layout-plus';
import CReservationByTableModal from '@/components/pages/TimeTable/ui/components/modals/CReservationByTableModal.vue';

/**
 * Поле, отвечающее за адаптивность экрана (десктопное ли устройство)
 */
const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

/**
 * Экземпляр класса {@link useScheduleRequestsStore}
 */
const scheduleRequestsStore = useScheduleRequestsStore();

/**
 * @param {object[]} layout Данные о расположении и названии отображаемых элементов столов
 */
defineProps<{
  layout: object[];
}>();
</script>

<style lang="scss">
@import "@/styles/colorVars.scss";

.vgl-item {
  &--resizing {
    opacity: 90%;
  }

  &__resizer {
    display: none;
  }

  &--placeholder {
    z-index: var(--vgl-placeholder-z-index, 2);
    user-select: none;
    background-color: var(--vgl-placeholder-bg, $lk-red);
    opacity: var(--vgl-placeholder-opacity, 20%);
    transition-duration: 100ms;
  }

  &:not(.vgl-item--placeholder) {
    background-color: $lk-white;
    border: 1px solid $lk-gb-40;
    border-radius: 5px;

    &.grid-item--vertical-text {
      writing-mode: vertical-lr;
      text-orientation: sideways-right;
      display: flex;
      justify-content: center;
      align-items: center;

      .text--rotate {
        transform: rotate(180deg);
      }
    }

    &:hover {
      background-color: $lk-blue-light;
      border: 1px solid $lk-blue;
      .text {
        color: $lk-blue;
      }
    }

    &[aria-expanded="true"] {
      background-color: $lk-white;
      border: 2px solid $lk-blue;
      .text {
        color: $lk-blue;
        font-weight: bold;
      }
    }

    &.grid-item--disabled {
      pointer-events: none;
      cursor: not-allowed;
    }

    &.grid-item--clickable {
      pointer-events: auto;

      &:hover {
        cursor: pointer; 
      }
    }
  }
}
</style>
