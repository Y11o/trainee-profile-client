<template>
  <c-tabs-panel
    route-name="AssistantPanelPage"
    :items="tabs"
  />
</template>

<script setup lang="ts">
import type { ITabsPanel } from '@/components/common/interfaces/ITabsPanel';
import CertificatesTable from '@/components/pages/AssistantPanelPage/ui/components/CertificatesTable.vue';
import UploadAttendance from '@/components/pages/AssistantPanelPage/ui/components/UploadAttendance.vue';
import CTabsPanel from '@/components/common/ui/CTabsPanel.vue';

const tabs: ITabsPanel[] = [
  {
    title: 'СЕРТИФИКАТЫ',
    path: '/assistant-panel/certificates',
    component: CertificatesTable,
  },
  {
    title: 'ПОСЕЩАЕМОСТЬ',
    path: '/assistant-panel/scud-attendance',
    component: UploadAttendance,
  }
];
</script>
