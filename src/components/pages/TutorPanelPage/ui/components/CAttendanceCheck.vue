<template>
  <v-container
    class="h-100 d-flex pa-0"
    fluid
  >
    <attendance-check-table :attendance-check-api="attendanceCheckApi"/>
  </v-container>
</template>

<script setup lang="ts">
import { TutorPanelApi } from '@/components/pages/TutorPanelPage/network/TutorPanelApi';
import AttendanceCheckTable from '@/components/pages/TutorPanelPage/ui/components/tables/AttendanceCheckTable/AttendanceCheckTable.vue';

const attendanceCheckApi = new TutorPanelApi('scud-attendance');
</script>

<style scoped lang="scss">
@import '@/styles/colorVars.scss';
</style>

