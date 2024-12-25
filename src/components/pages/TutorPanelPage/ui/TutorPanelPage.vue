<template>
  <c-tabs-panel
    route-name="TutorPanelPage"
    :items="tabs"
  />
</template>

<script setup lang="ts">
import CMeetings from '@/components/pages/TutorPanelPage/ui/components/CMeetings.vue';
import CViewGroups from '@/components/pages/TutorPanelPage/ui/components/CViewGroups.vue';
import TraineeRequestsTable from '@/components/pages/TutorPanelPage/ui/components/tables/TraineeRequestsTable.vue';
import CRssDialogs from '@/components/pages/TutorPanelPage/ui/components/CRssDialogs.vue';
import CInternalMeetings from '@/components/pages/TutorPanelPage/ui/components/CInternalMeetings.vue';
import CAttendanceCheck from '@/components/pages/TutorPanelPage/ui/components/CAttendanceCheck.vue';
import CTabsPanel from '@/components/common/ui/CTabsPanel.vue';
import type { ITabsPanel } from '@/components/common/interfaces/ITabsPanel';

const tabs: ITabsPanel[] = [
  {
    title: 'ПРОСМОТР ГРУПП',
    path: '/tutor-panel/view-groups',
    component: CViewGroups,
  },
  {
    title: 'ЗАПРОСЫ СТАЖЁРОВ',
    path: '/tutor-panel/trainee-requests',
    component: TraineeRequestsTable,
  },
  {
    title: 'МИТИНГИ',
    path: '/tutor-panel/meetings',
    component: CMeetings,
  },
  {
    title: 'ПРОВЕРКА ПОСЕЩАЕМОСТИ',
    path: '/tutor-panel/attendance-check',
    component: CAttendanceCheck,
  },
  {
    title: 'РСС ДИАЛОГИ',
    path: '/tutor-panel/rss-dialogs',
    component: CRssDialogs,
  },
  {
    title: 'ВНУТРЕННИЕ ВСТРЕЧИ',
    path: '/tutor-panel/internal-meetings',
    component: CInternalMeetings,
  },
];
</script>
