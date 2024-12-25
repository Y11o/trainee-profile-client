<template>
  <v-container
    class="d-flex h-100 pa-0"
    fluid
  >
    <v-row>
      <v-col
        cols=12
        lg="4"
      >
        <weekly-meetings-table
          :meetings-data="meetingsData"
          :is-data-received="isMeetingInfoReceived"
          @select="selectMeeting"
        />
      </v-col>
      <v-col
        cols=12
        lg="3"
      >
        <meeting-members-table
          :meeting-members="meetingMembers"
          :is-data-received="isDataReceived"
          @select="updateAttendance"
        />
      </v-col>
      <v-col
        cols=12
        lg="5"
      >
        <meeting-info-table
          :meeting-info="meetingInfo"
          :is-data-received="isDataReceived"
          @cancel-meeting="openModal('cancel')"
          @change-date="openModal('date')"
          @change-tutor="openModal('tutor')"
          @update-video-call="confirmChangesFromInfo"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-overlay
    v-model="isModalShown"
    class="d-flex justify-center align-center"
  >
    <cancel-meeting-modal
      v-if="currentModalType === 'cancel'"
      :meeting-details="meetingInfo.details"
      @confirm="confirmChangesFromModal"
      @close-modal="isModalShown = false"
    />
    <curator-name-select-modal
      v-if="currentModalType === 'tutor'"
      :curator-names="curatorData"
      :meeting-details="meetingInfo.details"
      @confirm="confirmChangesFromModal"
      @close-modal="isModalShown = false"
    />
    <meeting-date-modal
      v-if="currentModalType === 'date'"
      :meetingInfo="meetingInfo"
      @confirm-date-time="confirmChangesFromModal"
      @close-modal="isModalShown = false"
    />
  </v-overlay>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { MeetingModel } from '@/components/pages/TutorPanelPage/models/Meetings/MeetingModel';
import { TutorPanelApi } from '@/components/pages/TutorPanelPage/network/TutorPanelApi';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import { parseDateTime, sortByProperty, toISO } from '@/lib/utils';
import MeetingInfoTable from '@/components/pages/TutorPanelPage/ui/components/tables/Meetings/MeetingInfoTable.vue';
import MeetingMembersTable from '@/components/pages/TutorPanelPage/ui/components/tables/Meetings/MeetingMembersTable.vue';
import WeeklyMeetingsTable from '@/components/pages/TutorPanelPage/ui/components/tables/Meetings/WeeklyMeetingsTable.vue';
import CancelMeetingModal from '@/components/pages/TutorPanelPage/ui/components/modals/CancelMeetingModal.vue';
import CuratorNameSelectModal from '@/components/pages/TutorPanelPage/ui/components/modals/CuratorNameSelectModal.vue';
import MeetingDateModal from '@/components/pages/TutorPanelPage/ui/components/modals/MeetingDateModal.vue';

const snackbarStore = useSnackbarStore();
const userDataStore = useUserDataStore();

const meetingsApi = new TutorPanelApi('');

const isModalShown = ref<boolean>(false);

/** Переменная, хранящая тип модального окна */
const currentModalType = ref<string>('');

/** Переменная, хранящая статус получения данных о митингах с сервера */
const isDataReceived = ref<boolean>(true);

/** Переменная, хранящая статус получения данных о выбранном митинге с сервера */
const isMeetingInfoReceived = ref<boolean>(false);

/** Переменная, хранящая митинги групп, закрепленных за куратором */
const meetingsData = ref<MeetingModel[]>([]);

/** Переменная, хранящая данные кураторов */
const curatorData = ref<IEmployeeTutorPanelData[]>([]);

/** Переменная, хранящая данные участников выбранного митинга */
const meetingMembers = reactive({ trainees: [] }) as unknown as IMeetingMembers;

/** Переменная, хранящая данные о выбранном митинге */
const meetingInfo = reactive({ id: null }) as IMeetingInfo;

onBeforeMount(async () => {
  await getMeetingsData();
  isMeetingInfoReceived.value = true;
});

/**
 * Метод получения данных о митингах. Вызывает метод {@link getMeetingData}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const getMeetingsData = async () => meetingsApi.getMeetingData()
  .then((result) => {
    meetingsData.value = result.map(e => new MeetingModel(e));
    sortMeetings();
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось загрузить данные о митингах. Обновите страницу.'
    ));

/**
 * Метод обновления статуса присутствия стажера на митинге. Вызывает метод {@link updateTraineeAttendanceStatus}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const updateAttendance = async (item: { traineeId: number, attendanceStatusId: number }) =>
  meetingsApi.updateTraineeAttendanceStatus([{ ...item, videoCallId: meetingInfo.id } as IAttendanceStatus])
  .then(async () => {
    isMeetingInfoReceived.value = false;
    isDataReceived.value = false;
    await getMeetingsData();
    selectMeeting(meetingsData.value.find((item) => item.id === meetingInfo.id));
    isMeetingInfoReceived.value = true;
    isDataReceived.value = true;
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось обновить статус присутствия на митинге. Обновите страницу.',
      { icon: 'error' }
    ));

/**
 * Метод обновления информации о митинге. Вызывает метод {@link updateMeetingData}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const updateMeeting = async (newMeetingData: INewMeetingData) => meetingsApi.updateMeetingData(newMeetingData)
  .then((result) => {
    isMeetingInfoReceived.value = false;
    isDataReceived.value = false;
    meetingsData.value = result.map(e => new MeetingModel(e));
    sortMeetings();
    selectMeeting(meetingsData.value.find((item) => item.id === meetingInfo.id));
    isMeetingInfoReceived.value = true;
    isDataReceived.value = true;
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось обновить данные о митингах. Обновите страницу.',
      { icon: 'error' }
    ));

/**
 * Метод получения информации о кураторах. Вызывает метод {@link getTutorData}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const getTutors = async () => meetingsApi.getTutorData()
  .then((result) => {
    curatorData.value = result;
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось загрузить данные о кураторах. Обновите страницу.',
      { icon: 'error' }
    ));

/**
 * Метод, отвечающий за передачу данных из модального окна в метод {@link makeNewMeetingData}
 * для дальнейшего обновления данных
 */
const confirmChangesFromModal = async (changedAttr = null) => {
  isModalShown.value = false;
  await makeNewMeetingData(currentModalType.value, changedAttr);
};

/**
 * Метод, отвечающий за передачу данных из таблицы с информацией о митинге в метод {@link makeNewMeetingData}
 * для дальнейшего обновления данных
 */
const confirmChangesFromInfo = async (newMeetingDetails: IMeetingCommonData) => {
  await makeNewMeetingData('info', newMeetingDetails);
};

/** Метод, отвечающий за формирование новых данных о митинге и передачу их в метод {@link updateMeeting} */
const makeNewMeetingData = async (type = '', newData: any = null) => {
  const dataToUpdate = {
    id: meetingInfo.id,
    timeStarted: toISO(meetingInfo.dateTime),
    leaderId: userDataStore.userID,
    statusId: meetingStatuses.indexOf(meetingInfo.videoCallStatus) + 1,
    description: meetingInfo.description,
    videoCallLink: meetingInfo.videoCallLink,
    videoCallRecordLink: meetingInfo.videoCallRecordLink,
  } as INewMeetingData;
  if (type === 'cancel') {
    dataToUpdate.statusId = 2;
  }
  if (type === 'tutor') {
    dataToUpdate.leaderId = newData;
  }
  if (type === 'date') {
    dataToUpdate.timeStarted = newData;
    dataToUpdate.statusId = 1;
  }
  if (type === 'info') {
    Object.assign(dataToUpdate, {
      ...newData
    });
  }
  await updateMeeting(dataToUpdate);
};

/** Метод, отвечающий за показ модального окна выбранного типа */
const openModal = async (modalType: string) => {
  if (modalType === 'cancel') {
    currentModalType.value = 'cancel';
  }
  if (modalType === 'date') {
    currentModalType.value = 'date';
  }
  if (modalType === 'tutor') {
    await getTutors();
    currentModalType.value = 'tutor';
  }
  isModalShown.value = true;
};

/** Метод, отвечающий за формирование данных о выбранном митинге */
const selectMeeting = (meeting?: MeetingModel) => {
  meetingMembers.groupNumber = meeting?.groupNumber ?? null;
  // @ts-expect-error
  meetingMembers.trainees = sortByProperty((meeting?.trainees ?? []) as unknown as IMeetingMember[], 'fullName');
  meetingInfo.id = meeting?.id ?? null;
  meetingInfo.videoCallStatus = meeting?.videoCallStatus ?? '';
  meetingInfo.dateTime = meeting?.dateTime ?? '';
  meetingInfo.jiraLink = meeting?.jiraLink ?? '';
  meetingInfo.videoCallLink = meeting?.videoCallLink ?? '';
  meetingInfo.videoCallRecordLink = meeting?.videoCallRecordLink ?? '';
  meetingInfo.description = meeting?.description ?? '';
  meetingInfo.details = meeting
    ? `Группа №${ meeting.groupNumber }, ${ meeting.departmentBranchName }, ${ parseDateTime(meeting.dateTime) }`
    : '';
};

/**
 * Метод, отвечающий за сортировку митингов по двум параметрам: сначала по статусу, затем по дате в порядке возрастания
 */
const sortMeetings = () => {
  meetingsData.value.sort(function (a, b) {
    return meetingStatuses.indexOf(b.videoCallStatus) - meetingStatuses.indexOf(a.videoCallStatus)
      || ((new Date(a.dateTime)).getTime() - (new Date(b.dateTime)).getTime());
  });
};

/** Статусы митингов: 'Запланировано', 'Отменено', 'Завершено' */
const meetingStatuses = ['Запланировано', 'Отменено', 'Завершено'];
</script>
