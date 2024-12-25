<template>
  <v-data-table-virtual
    class="mb-1"
    density="compact"
    expand-on-click
    show-expand
    hover
    loading-text="Данные загружаются..."
    :height="mdAndUp ? '356px' : '600px'"
    :loading="!isDataReceived"
    :headers="headers"
    :items="tasks"
    :mobile="!mdAndUp"
    :row-props="(e) => getColorFromStatus(e.item, 'text')"
  >
    <template #item.marker>
      <v-icon
        v-if="mdAndUp"
        icon="mdi-circle-medium"
      />
    </template>
    <template #expanded-row="{ columns, item }">
      <tr>
        <td
          class="expanded-row"
          :colspan="columns.length"
        >
          <task-info-component :task="item" />
        </td>
      </tr>
    </template>
    <template #item.color-text-status="{ item }">
      <v-btn
        class="status-element"
        variant="tonal"
        density="comfortable"
        rounded="lg"
        width="300"
        v-bind="getColorFromStatus(item)"
      >
        {{ item.status }}
      </v-btn>
    </template>
    <template #no-data>
      <v-alert
        class="transparent-alert"
        type="info"
        :value="true"
      >
        Данные отсутствуют
      </v-alert>
    </template>
  </v-data-table-virtual>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import type { ProgressTrackerModel } from '@/components/pages/MainPage/models/progressTracker/ProgressTrackerModel';
import type { ITaskStatus } from '@/components/pages/MainPage/interfaces/MainPageInterfaces';
import TaskInfoComponent from '@/components/pages/MainPage/ui/components/ProgressTracker/TaskInfo/CTaskInfoComponent.vue';

/**
 * @property {object[]} [headers = []] Массив, содержжащий заголовки таблицы прогресс-трека
 * @property {ProgressTrackerModel[]} [tasks = []] Массив заданий, которые выполнял или выполняет стажер
 * @property {ITaskStatus[]} [taskStatuses = []] Статусы, которые могут иметь задания
 * @property {boolean} isDataReceived Статус получения данных с сервера
 */
const props = withDefaults(
  defineProps<{
    headers: object[];
    tasks: ProgressTrackerModel[];
    taskStatuses: ITaskStatus[];
    isDataReceived: boolean;
  }>(),
  {
    headers: () => [],
    tasks: () => [],
    taskStatuses: () => [],
  },
);

const { mdAndUp } = useDisplay();

const getColorFromStatus = (item: ProgressTrackerModel, type: 'text' | 'status' = 'status'): object | void => {
  if (props.taskStatuses && props.taskStatuses.length) {
    const correspondingItem = props.taskStatuses.find(taskStatus => taskStatus.value === item.status);
    if (correspondingItem) {
      if (type === 'text') {
        return { style: { color: correspondingItem.textColor || correspondingItem.color } };
      }
      return { style: { color: correspondingItem.color } };
    }
  }
};
</script>

<style scoped lang="scss">
:deep(.v-data-table__tr) :last-child {
  .v-btn:hover > .v-btn__overlay {
    visibility: hidden;
  }

  .v-ripple__container {
    visibility: hidden;
  }
}

:deep(.v-data-table-headers--mobile) {
  display: none;
}

.expanded-row {
  border-bottom: none !important;

  &::after {
    visibility: hidden;
  }
}

.status-element {
  text-transform: none;
  pointer-events: none;
}
</style>
