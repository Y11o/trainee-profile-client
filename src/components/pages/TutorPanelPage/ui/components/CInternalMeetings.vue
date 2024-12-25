<template>
  <v-container
    class="d-flex h-100 pa-0"
    fluid
  >
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
        <internal-meetings-table
          :meetings-data="internalMeetingsData"
          :is-data-received="isDataReceived"
          @select="selectMeeting"
        />
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <internal-meeting-info-table
          :is-loading="areDetailsLoading"
          :internal-meeting-info="internalMeetingInfo"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue';
import { InternalMeetingModel } from '@/components/pages/TutorPanelPage/models/InternalMeetings/InternalMeetingModel';
import { TutorPanelApi } from '@/components/pages/TutorPanelPage/network/TutorPanelApi';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import InternalMeetingsTable from '@/components/pages/TutorPanelPage/ui/components/tables/InternalMeetingsTable.vue';
import InternalMeetingInfoTable from '@/components/pages/TutorPanelPage/ui/components/tables/InternalMeetingInfoTable.vue';

const snackbarStore = useSnackbarStore();

const internalMeetingApi = new TutorPanelApi('/events');

/** Переменная, хранящая статус получения данных внтуренних встреч с сервера */
const isDataReceived = ref<boolean>(false);

/** Переменная, хранящая статус получения данных внутренней встречи с сервера */
const areDetailsLoading = ref<boolean>(false);

/** Переменная, хранящая информацию о внутренних встречах */
const internalMeetingsData = ref<InternalMeetingModel[]>([]);

/** Переменная, хранящая информацию о выбранной внутренней встрече */
const internalMeetingInfo = reactive({
  eventId: null,
  comment: '',
  departmentName: '',
  employee: { id: null, fullName: '' },
  eventStatus: { id: 0, name: '' },
  groupNumber: 0,
  timeStarted: '',
  title: '',
  event: { cabinet: '', timeStarted: 0, title: '' },
  members: []
}) as IInternalMeetingInfoData;

onBeforeMount(async () => {
  await getInternalMeetingData();
});

/**
 * Метод получения данных о внутренних встречах. Вызывает метод {@link getInternalMeetingDataByTutor}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const getInternalMeetingData = async () => internalMeetingApi.getInternalMeetingDataByTutor()
  .then((result) => {
    internalMeetingsData.value = result.map((item) => new InternalMeetingModel(item));
    isDataReceived.value = true;
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось загрузить данные о внутренних встречах. Обновите страницу.',
      { icon: 'error' }
    ));

/**
 * Метод получения данных о выбранной внутренней встрече. Вызывает метод {@link getInternalMeetingDetails}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const getInternalMeetingInfo = async (id: number) => internalMeetingApi.getInternalMeetingDetails(id)
  .then((result) => {
    Object.assign(internalMeetingInfo, {
      ...result
    });
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось загрузить данные о внутренних встречах. Обновите страницу.',
      { icon: 'error' }
    ));

/** Метод, отвечающий за выбор внутренней встречи. Вызывает метод {@link getInternalMeetingInfo}. */
const selectMeeting = async (item: InternalMeetingModel) => {
  areDetailsLoading.value = true;
  Object.assign(internalMeetingInfo, {
    ...item
  });
  await getInternalMeetingInfo(item.eventId);
  areDetailsLoading.value = false;
};
</script>
