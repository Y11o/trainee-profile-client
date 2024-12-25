<template>
  <div class="block_centered header-container border-b-sm px-5 py-4">
    <div class="block_centered ga-1">
      <span class="font-weight-medium">ТРЕК РАЗВИТИЯ</span>
      <span
        v-if="isOldData"
        class="old-data font-weight-medium"
        v-tooltip="`Нажмите кнопку 'Обновить'`"
      >
        (ДАННЫЕ УСТАРЕЛИ)
      </span>
    </div>
    <div class="block_centered">
      <c-color-filters
        filter-param="status"
        :filters="taskStatuses"
        :items-to-filter="tasks"
        @on-apply-filters="changeStatusFilter"
      />
      <div class="block_centered flex-nowrap ga-1 ml-1">
        <v-btn
          v-tooltip="'Обновить'"
          class="refresh-button"
          icon="mdi-cached"
          density="compact"
          variant="text"
          @click="showUpdateTasks"
        />
        <progress-tracker-plus-button
          @show-add-course="showAddCourse"
          @show-add-task="showAddTask"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';
import type { ITaskStatus } from '@/components/pages/MainPage/interfaces/MainPageInterfaces';
import type { ProgressTrackerModel } from '@/components/pages/MainPage/models/progressTracker/ProgressTrackerModel';
import ProgressTrackerPlusButton from '@/components/pages/MainPage/ui/components/ProgressTracker/ProgressTrackerPlusButton.vue';
import CColorFilters from '@/components/common/ui/CColorFilters.vue';
import CAddCourseComponent from '@/components/pages/MainPage/ui/components/ProgressTracker/AddCourse/CAddCourseComponent.vue';
import CAddTaskComponent from '@/components/pages/MainPage/ui/components/ProgressTracker/AddTask/CAddTaskComponent.vue';
import CWeeklyReportComponent from '@/components/pages/MainPage/ui/components/ProgressTracker/WeeklyReport/CWeeklyReportComponent.vue';

/**
 * @property {ProgressTrackerModel[]} tasks Массив заданий, которые выполнял или выполняет стажер
 * @property {ITaskStatus[]} taskStatuses Статусы, которые могут иметь задания
 * @property {boolean} isOldData Индикатор необходимости обновления данных
 */
withDefaults(
  defineProps<{
    tasks: ProgressTrackerModel[];
    taskStatuses: ITaskStatus[];
    isOldData: boolean;
  }>(),
  {
    tasks: () => [],
    taskStatuses: () => [],
    isOldData: false,
  },
);

const emit = defineEmits(['ChangeStatusFilter']);

const drawerStore = useDrawerStore();

/** Метод, который эмитит измененный массив объектов-заданий при обновлении значения цветового фильтра */
const changeStatusFilter = (items: object[]) => emit('ChangeStatusFilter', items);

/** Метод, открывающий вкладку добавления теоретического курса. Вызывает метод open из класса {@link useDrawerStore}*/
const showAddCourse = () => drawerStore.open<typeof CAddCourseComponent>({
  CAddCourseComponent: defineAsyncComponent(() =>
    import('@/components/pages/MainPage/ui/components/ProgressTracker/AddCourse/CAddCourseComponent.vue'))
});

/** Метод, открывающий вкладку добавления практического задания. Вызывает метод open из класса {@link useDrawerStore}*/
const showAddTask = () => drawerStore.open<typeof CAddTaskComponent>({
  CAddTaskComponent: defineAsyncComponent(() =>
    import('@/components/pages/MainPage/ui/components/ProgressTracker/AddTask/CAddTaskComponent.vue'))
});

/** Метод, открывающий вкладку утверждения часов. Вызывает метод open из класса {@link useDrawerStore} */
const showUpdateTasks = () => drawerStore.open<typeof CWeeklyReportComponent>({
  CWeeklyReportComponent: defineAsyncComponent(() =>
    import('@/components/pages/MainPage/ui/components/ProgressTracker/WeeklyReport/CWeeklyReportComponent.vue')),
});
</script>

<style scoped lang="scss">
@import "@/styles/colorVars";

.block_centered {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.header-container {
  justify-content: space-between;
}

.old-data {
  color: $lk-red;
}

.refresh-button {
  color: $lk-gr;
}
</style>
