<template>
  <v-card elevation="0">
    <v-card-text>
      <div>
        <span class="font-weight-medium">Дата начала выполнения: </span>{{ task.timeStarted }}
      </div>
      <template v-if="status.completed && taskType.practice">
        <span class="font-weight-medium">Дата завершения практического задания:</span> {{ task.timeFinished }}
      </template>
      <template v-if="taskType.course && (status.completed || status.onReview)">
        <div v-if="task.certificateSendTime">
          <span class="font-weight-medium">Дата отправки сертификата:</span> {{ task.certificateSendTime }}
        </div>
        <div v-if="task.certificateName">
          <span class="font-weight-medium">Сертификат:</span> <span class="text-decoration-underline cursor-pointer">{{ task.certificateName }}</span>
        </div>
      </template>
    </v-card-text>
    <v-card-actions class="pt-0">
      <v-spacer/>
      <v-btn
        v-if="!status.completed"
        variant="outlined"
        density="comfortable"
        :disabled="status.onReview"
        @click="showComplete"
      >
        <template v-if="taskType.course">Завершить курс</template>
        <template v-else-if="taskType.practice">Завершить задание</template>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, toRefs, defineAsyncComponent } from 'vue';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';
import type { ProgressTrackerModel } from '@/components/pages/MainPage/models/progressTracker/ProgressTrackerModel';
import CCompleteCourseComponent from '@/components/pages/MainPage/ui/components/ProgressTracker/CompleteCourse/CCompleteCourseComponent.vue';
import CCompleteTaskComponent from '@/components/pages/MainPage/ui/components/ProgressTracker/CompleteTask/CCompleteTaskComponent.vue';

/**
 * @property {ProgressTrackerModel} task Данные о задании
 */
const props = defineProps<{
  task: ProgressTrackerModel
}>();

const { task } = toRefs(props);

const drawerStore = useDrawerStore();

/** Вычисляемое свойство типа задания */
const taskType = computed(() => ({
  course: props.task.type === 'Курс',
  practice: (props.task.type === 'Практическое задание') || (props.task.type === 'Практ. задание'),
}));

/** Вычисляемое свойство статуса задания */
const status = computed(() => ({
  onReview: props.task.status === 'Ожидает подтверждения ассистента',
  completed: props.task.status === 'Закрыт',
  expired: props.task.status === 'Просрочено',
  atWork: props.task.status === 'В работе',
}));

/**
 * Метод, открывающий панель справа для добавления курса, если значение taskType.course true, или для добавления практического
 * задания. Вызывает метод open класса {@link useDrawerStore}
 */
 const showComplete = () => {
  if (taskType.value.course) {
    drawerStore.open<typeof CCompleteCourseComponent>({
      CCompleteCourseComponent: defineAsyncComponent(() =>
        import('@/components/pages/MainPage/ui/components/ProgressTracker/CompleteCourse/CCompleteCourseComponent.vue')),
      props: {
        task,
      },
    });
  } else if (taskType.value.practice) {
    drawerStore.open<typeof CCompleteTaskComponent>({
      CCompleteTaskComponent: defineAsyncComponent(() =>
        import('@/components/pages/MainPage/ui/components/ProgressTracker/CompleteTask/CCompleteTaskComponent.vue')),
      props: {
        task,
      },
    });
  }
};
</script>
