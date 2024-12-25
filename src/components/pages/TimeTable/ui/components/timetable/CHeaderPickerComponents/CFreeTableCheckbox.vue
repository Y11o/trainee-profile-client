<template>
  <v-checkbox
    v-model="isFreeTables"
    color="grey"
    label="показать только свободные столы"
    :hide-details="true"
    @change="useScheduleStore().setFreeTablesValue(isFreeTables)"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';

/**
 * Поле, отвечающее за отображение только свободных столов/всех столов
 */
const isFreeTables = ref<boolean>(false);
</script>