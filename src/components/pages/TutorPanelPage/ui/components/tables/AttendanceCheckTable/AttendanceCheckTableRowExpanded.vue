<template>
  <tr>
    <td
      class="py-2"
      colspan="6"
    >
      <v-sheet max-width="220">
        <v-data-table-virtual
          class="attendance-schedule-table"
          density="compact"
          :mobile="false"
          :headers="weekTableHeaders"
          :items="traineeAttendanceSchedule"
        />
      </v-sheet>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TraineeAttendanceModel } from '@/components/pages/TutorPanelPage/models/AttendanceCheck/TraineeAttendanceModel';

const props = defineProps<{
  item: TraineeAttendanceModel;
}>();

const traineeAttendanceSchedule = computed(() =>
  [props.item.attendanceData.reduce<Record<string, string>>((acc, curr) => {
    acc[curr.dayOfWeek] = (curr.workHours === '0:00' || curr.workHours === '00:00') ? '' : curr.workHours;
    return acc;
  }, {})]);

const weekTableHeaders = [
  { title: 'ПН', value: 'monday', align: 'center' },
  { title: 'ВТ', value: 'tuesday', align: 'center' },
  { title: 'СР', value: 'wednesday', align: 'center' },
  { title: 'ЧТ', value: 'thursday', align: 'center' },
  { title: 'ПТ', value: 'friday', align: 'center' },
] as object[];
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

:deep(.attendance-schedule-table) {
  table {
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 3px 0;
  }

  thead {
    .v-data-table__td {
      height: 12px;
      color: $lk-white;
      background-color: $lk-gb-50;
    }
  }

  tbody {
    .v-data-table__td {
      padding: 0;
      height: 18px;
      font-weight: 500;
      border: 2px solid $lk-gb-50 !important;
    }
  }
}
</style>
