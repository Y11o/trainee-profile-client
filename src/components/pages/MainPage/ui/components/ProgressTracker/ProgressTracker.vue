<template>
  <div class="bordered-block">
    <progress-tracker-header
      :tasks="employeeStore.employeeData?.trackerTasks"
      :task-statuses="taskStatuses"
      :is-old-data="isOldData"
      @change-status-filter="filterTasksByStatus"
    />
    <progress-tracker-table
      :headers="headers"
      :tasks="displayedTasks"
      :task-statuses="taskStatuses"
      :is-data-received="employeeStore.isDataReceived"
    />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import type { ProgressTrackerModel } from '@/components/pages/MainPage/models/progressTracker/ProgressTrackerModel';
import type { ITaskStatus } from '@/components/pages/MainPage/interfaces/MainPageInterfaces';
import ProgressTrackerHeader from '@/components/pages/MainPage/ui/components/ProgressTracker/ProgressTrackerHeader.vue';
import ProgressTrackerTable from '@/components/pages/MainPage/ui/components/ProgressTracker/ProgressTrackerTable.vue';

const drawerStore = useDrawerStore();
const snackbarStore = useSnackbarStore();
const employeeStore = useEmployeeStore();
const userDataStore = useUserDataStore();

/** Переменная, отвечающая за показ/скрытие строки о необходимости обновления данных */
const isOldData = ref<boolean>(false);

/** Массив отображаемых заданий */
const displayedTasks = ref<ProgressTrackerModel[]>([]);

/**
 * Массив из статусов, которые могут принимать задания. Статус содержит значение, цвет для окрашивания строки с
 * заданием и подсказку цветового фильтра
 */
const taskStatuses = ref<ITaskStatus[]>([
  { color: '#559E15', textColor: '#D5D9DC', value: 'Закрыт', tooltip: 'Закрыт' },
  { color: '#000000', value: 'В работе', tooltip: 'В работе' },
  { color: '#CD4141', value: 'Просрочено', tooltip: 'Просрочено' },
  { color: '#FFB22C', textColor: '#000000', value: 'Ожидает подтверждения ассистента', tooltip: 'Ожидает подтверждения ассистента' }
]);

/** Заголовки таблицы прогресс-трека */
const headers = ref<object[]>([
  { title: '', key: 'marker', sortable: false, maxWidth: 32 },
  { title: 'Название', key: 'name', sortable: false },
  { title: 'Тип', key: 'type', sortable: false },
  { title: 'Дата начала', key: 'timeStarted', sortable: false },
  { title: 'Дата окончания', key: 'timeFinished', sortable: false },
  { title: '', key: 'color-text-status', sortable: false },
  { title: '', key: 'data-table-expand' },
]);

/** Обновление массива отображаемых заданий при изменении массива полученных заданий */
watch(
  () => employeeStore.employeeData?.trackerTasks, 
  (tasks) => {
    displayedTasks.value = tasks || [];
  }
);

onBeforeMount(async () => {
  if (userDataStore.isAuthorized) {
    await getWeeklyReportStatus();
  }
});

/** Изменение переменной isOldData, отвечающей за показ/скрытие строки о необходимости обновления данных */
const updateProgressTrackerStatus = () => isOldData.value = false;

/**
 * Получение статуса еженедельного отчета с сервера. Вызывает метод {@link getLastWeeklyReportDate}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const getWeeklyReportStatus = async () =>
  employeeStore.employeeApi.getLastWeeklyReportDate()
    .then((result) => {
      checkIfLastWeeklyReportIsOld(result.lastTimeReported);
    })
    .catch((e) => {
      if (e.response?.status === 404 && employeeStore.employeeData?.trackerTasks.length) {
        snackbarStore.openSnackbar('Данные еженедельного отчета отсутствуют. Не забудьте утвердить часы.');
      } else {
        snackbarStore.openSnackbar('Не удалось получить статус еженедельного отчета. Обновите страницу', {
          icon: 'error',
        });
      }
    });

/** Отслеживание события success компонента отправки еженедельного отчета */
drawerStore.useEmits({
  CWeeklyReportComponent: {
    success: updateProgressTrackerStatus,
  }
});

/** Фильтрация заданий по статусу */
const filterTasksByStatus = (items: ProgressTrackerModel[]) => {
  displayedTasks.value = items || (employeeStore.employeeData?.trackerTasks || []);
};

/** Проверка давности еженедельного отчета: если прошло больше недели, то данные устарели */
const checkIfLastWeeklyReportIsOld = (lastWeeklyReportDate: string) => {
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  (lastWeek.getTime() >= (new Date(lastWeeklyReportDate)).getTime())
    ? isOldData.value = true
    : isOldData.value = false;
};
</script>
