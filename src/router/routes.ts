import type { RouteRecordRaw } from 'vue-router';
import { RoleEnum } from '@/components/common/constants/RoleEnum';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'mainPage',
    component: () => import('@/components/pages/MainPage/ui/MainPage.vue'),
  },
  {
    path: '/auth',
    name: 'authPage',
    component: () => import('@/components/pages/AuthPage/ui/AuthPage.vue'),
  },
  {
    path: '/sched',
    name: 'timeTablePage',
    component: () => import('@/components/pages/TimeTable/ui/TimeTablePage.vue'),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: '/faq',
    name: 'FAQPage',
    component: () => import('@/components/pages/FAQPage/ui/FAQPage.vue'),
  },
  {
    path: '/tutor-panel',
    name: 'tutorPanelPage',
    redirect: { name: 'tutorPanelViewGroups' },
    component: () => import('@/components/pages/TutorPanelPage/ui/TutorPanelPage.vue'),
    meta: {
      permissions: [RoleEnum.USER_TUTOR],
    },
    children: [
      {
        path: 'view-groups',
        name: 'tutorPanelViewGroups',
        component: () => import('@/components/pages/TutorPanelPage/ui/components/CViewGroups.vue'),
      },
      {
        path: 'trainee-requests',
        name: 'tutorPanelTraineeRequests',
        component: () => import('@/components/pages/TutorPanelPage/ui/components/tables/TraineeRequestsTable.vue'),
      },
      {
        path: 'meetings',
        name: 'tutorPanelMeetings',
        component: () => import('@/components/pages/TutorPanelPage/ui/components/CMeetings.vue'),
      },
      {
        path: 'attendance-check',
        name: 'tutorPanelAttendanceCheck',
        component: () => import('@/components/pages/TutorPanelPage/ui/components/CAttendanceCheck.vue'),
      },
      {
        path: 'rss-dialogs',
        name: 'tutorPanelRssDialogs',
        component: () => import('@/components/pages/TutorPanelPage/ui/components/CRssDialogs.vue'),
      },
      {
        path: 'internal-meetings',
        name: 'tutorPanelInternalMeetings',
        component: () => import('@/components/pages/TutorPanelPage/ui/components/CInternalMeetings.vue'),
      },
    ],
  },
  {
    path: '/contacts',
    name: 'contactsPage',
    component: () => import('@/components/pages/ContactsPage/ui/ContactsPage.vue'),
  },
  {
    path: '/assistant-panel',
    name: 'assistantPanelPage',
    redirect: { name: 'assistantPanelCertificates' },
    meta: {
      // TODO: После появления роли ассистента убрать роль RoleEnum.USER_TUTOR из permissions
      // permissions: [RoleEnum.USER_ASSISTANT],
      permissions: [RoleEnum.USER_ASSISTANT, RoleEnum.USER_TUTOR],
    },
    component: () => import('@/components/pages/AssistantPanelPage/ui/AssistantPanelPage.vue'),
    children: [
      {
        path: 'certificates',
        name: 'assistantPanelCertificates',
        component: () => import('@/components/pages/AssistantPanelPage/ui/components/CertificatesTable.vue'),
      },
      {
        path: 'scud-attendance',
        name: 'assistantPanelScudAttendance',
        component: () => import('@/components/pages/AssistantPanelPage/ui/components/UploadAttendance.vue'),
      },
    ],
  },
];
