<template>
  <grid-layout
    :layout="layout"
    :row-height="18"
    :responsive="false"
    :vertical-compact="false"
    :col-num="col"
    :max-rows="12"
    :is-draggable="false"
    :is-resizable="false"
    prevent-collision
  >
    <c-table-element :layout="layout" />
  </grid-layout>   
</template>

<script setup lang="ts">
import { GridLayout } from 'grid-layout-plus';
import CTableElement from '@/components/pages/TimeTable/ui/components/plan/layout/CTableElement.vue';

/**
 * @param {object[]} layout Данные о расположении и названии отображаемых элементов столов
 * @param {number} col Количество колонок, занимаемых данной сеткой
 */
defineProps<{
  layout: object[];
  col: number;
}>();
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.vgl-layout {
  background-color: $lk-gr-background;
  border-radius: 8px;
  border: 1px solid $lk-gb-40;
  min-height: calc(100% - 24px);
  max-height: calc(100% - 24px);
}
</style>