<template>
  <tr>
    <template
      v-for="header in headers"
      :key="header.value"
    >
      <th
        class="px-2 py-0"
        :colspan="(header.value === 'time' && !isDesktop) ? 2 : 1"
      >
        <component
          v-if="isDesktop"
          :is="header.componentFullScreen"
          :title="header.title"
          :hide-weekends="header.title === 'date'"
          :current-date="currentDate"
        />
        <component
          v-else
          :is="header.component"
          :title="header.title"
          :hide-weekends="header.title === 'date'"
          :current-date="currentDate"
        />
      </th>
    </template>
  </tr>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import type { ComputedRef } from 'vue';
import type { IHeaderPickerInterface } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';

/**
 * Поле, отвечающее за адаптивность экрана (десктопное ли устройство)
 */
const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

/**
 * @param {Date} currentDate Переменная, хранящая выбранную дату
 * @param {IHeaderPickerInterface[]} headers Компоненты шапки таблицы расписания
 */
withDefaults(
  defineProps<{
    currentDate: Date,
    headers: IHeaderPickerInterface[],
  }>(),
  {
    currentDate: () => new Date(),
    headers: () => [],
  }
);
</script>
