<template>
  <c-table-container header-density="default">
    <template #header>
      <div class="w-100 h-100 d-flex justify-space-between align-center ga-12">
        <attendance-week-picker @select-week="selectWeek" />
        <v-combobox
          v-model.trim="searchQuery"
          class="header-combobox"
          variant="outlined"
          placeholder="ФИО Стажера"
          hide-details
          :max-width="352"
          :items="trainees"
        />
      </div>
    </template>
    <v-data-table-virtual
      class="attendance-table"
      density="compact"
      expand-on-click
      show-expand
      hover
      :loading="isLoading"
      :mobile="false"
      :headers="attendanceTableHeaders"
      :items="attendanceData"
    >
      <template #item="{ item, toggleExpand, isExpanded, internalItem }">
        <attendance-check-table-row
          :item="item"
          :attendance-check-api="attendanceCheckApi"
          :attendanceAbsenteeReasonList="attendanceAbsenteeReasonList"
          :row-expand-api="{ toggleExpand, isExpanded, internalItem }"
        />
      </template>
      <template #expanded-row="{ item }">
        <attendance-check-table-row-expanded :item="item" />
      </template>
    </v-data-table-virtual>
  </c-table-container>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { TutorPanelApi } from '@/components/pages/TutorPanelPage/network/TutorPanelApi';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { TraineeAttendanceModel } from '@/components/pages/TutorPanelPage/models/AttendanceCheck/TraineeAttendanceModel';
import { useLoading } from '@/lib/utils/useLoading';
import { sortByProperty } from '@/lib/utils';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';
import AttendanceWeekPicker from '@/components/pages/TutorPanelPage/ui/components/tables/AttendanceCheckTable/AttendanceTableWeekPicker.vue';
import AttendanceCheckTableRow from '@/components/pages/TutorPanelPage/ui/components/tables/AttendanceCheckTable/AttendanceCheckTableRow.vue';
import AttendanceCheckTableRowExpanded from '@/components/pages/TutorPanelPage/ui/components/tables/AttendanceCheckTable/AttendanceCheckTableRowExpanded.vue';

/**
 * @property {TutorPanelApi} attendanceCheckApi Класс для работы с сетью в рамках вкладки проверки посещаемости
 */
const props = defineProps<{
  attendanceCheckApi: TutorPanelApi;
}>();

const router = useRouter();
const snackbarStore = useSnackbarStore();

/** Переменная, хранящая статус получения данных с сервера */
const { isLoading, withLoading } = useLoading();

/** Переменная, хранящая данные недели, для которой отмечается посещаемость */
const attendanceWeek = ref<TraineeAttendanceModel[]>([]);

/** Переменная, хранящая список возможных причин */
const attendanceAbsenteeReasonList = ref<IAttendanceAbsenteeReason[]>([]);

/** Переменная, хранящая текст поисковой строки */
const searchQuery = ref<string>();

/** Список всех стажеров */
const trainees = computed(() => attendanceWeek.value.map((item) => item.trainee));

/** Отсортированный список посещений по ФИО стажера */
const attendanceData = computed(() =>
  searchQuery.value
    ? attendanceWeek.value.filter((item) =>
      item.trainee.toLowerCase().includes((searchQuery.value as string).toLowerCase().trim()))
    : attendanceWeek.value);

/** Получение данных по номеру недели */
const getWeekAttendance = (weekNumber: number) => withLoading(
  props.attendanceCheckApi.getAttendanceWeekData(weekNumber)
    .then((data) => {
      attendanceWeek.value = sortByProperty(data.map((e) => new TraineeAttendanceModel(e)), 'trainee');
    })
    .catch(() => snackbarStore.openSnackbar('Не удалось загрузить данные. Повторите попытку.', { icon: 'error' })));

/** Получение списка возможных причин */
const getAttendanceAbsenteeReasonList = () => {
  props.attendanceCheckApi.getAttendanceAbsenteeReasonList()
    .then((result) => {
      attendanceAbsenteeReasonList.value = result;
    })
    .catch(() => snackbarStore.openSnackbar('Ошибка загрузки данных.', { icon: 'error' }));
};

/** Получение данных выбранной неделе */
const selectWeek = async (weekNumber: number) => {
  await router.push({ query: { week: weekNumber } });
  await getWeekAttendance(weekNumber);
};

onBeforeMount(async () => await getAttendanceAbsenteeReasonList());

const attendanceTableHeaders = [
  { title: 'ФИО Стажера', value: 'trainee', width: '25%' },
  { title: 'Группа', value: 'groupNumber', width: '10%' },
  { title: 'Долг (из 10ч)', value: 'debt', width: '15%' },
  { title: 'Причина', value: 'fact', width: '15%' },
  { title: 'Комментарий', value: 'tutorComment', width: '35%' },
] as object[];
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

.attendance-table {
  &__expand-btn {
    :deep(.v-btn__overlay) {
      opacity: 0;
    }
  }
}

:deep(.header-combobox) {
  background-color: $lk-white;

  .v-field__input {
    flex-wrap: nowrap;
    height: 30px;
    min-height: 30px;
    font-size: 13px;
  }
}

:deep(.colors-green) {
  color: $lk-green;
}

:deep(.colors-red) {
  color: $lk-red;
}

:deep(.colors-yellow) {
  color: $lk-yellow;
}

:deep(.colors-blue) {
  color: $lk-blue;
}

:deep(.colors-gray) {
  color: $lk-gr;
}
</style>
