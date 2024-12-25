<template>
  <v-card variant="flat">
    <c-modal-header @close-icon-clicked="drawerStore.close">
      <template #header>
        <h3>Завершить задание</h3>
      </template>
    </c-modal-header>
    <v-card-text>
      Вы уверены, что хотите завершить практическое задание <span class="font-weight-medium">"{{ task.name }}"</span>?
    </v-card-text>
    <v-card-actions>
      <v-spacer/>
      <v-btn
        text="Завершить"
        density="comfortable"
        variant="outlined"
        :disabled="isLoading"
        @click="onConfirm"
      />
      <v-btn
        text="Отмена"
        density="comfortable"
        variant="outlined"
        @click="drawerStore.close"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import { useBaseModalStore } from '@/components/common/ui/widgets/store/BaseModalStore';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import { useLoading } from '@/lib/utils/useLoading';
import type { ProgressTrackerModel } from '@/components/pages/MainPage/models/progressTracker/ProgressTrackerModel';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';

/**
 * @param {ProgressTrackerModel} task Данные о задании (практическое задание)
 */
const props = defineProps<{
  task: ProgressTrackerModel;
}>();

const drawerStore = useDrawerStore();
const baseModalStore = useBaseModalStore();
const snackbarStore = useSnackbarStore();
const employeeStore = useEmployeeStore();

/** Переменная, хранящая статус получения данных с сервера */
const { isLoading, withLoading } = useLoading();

/** Отслеживание значения isConfirmed, если true, выполняется метод completeTask */
watch(() => baseModalStore.isConfirmed, (isConfirmed) => isConfirmed && onConfirmModal());

/** Показ модального окна с предупреждением. Вызывает метод openModal из класса {@link useBaseModalStore} */
const onConfirm = () => baseModalStore.openModal({
  title: 'Предупреждение',
  content: 'Вы точно хотите завершить задание?',
  hasControls: true,
  modalIconType: 'confirm',
  dialogWidth: '426',
});

/** Метод, отправляющий запрос о завершении практического задания. */
const onConfirmModal = () => withLoading(
  employeeStore.employeeApi.completeTask(useUserDataStore().userID, props.task.id)
    .then(() => {
      snackbarStore.openSnackbar(`Вы успешно завершили задание "${props.task.name}".`);
      employeeStore.getEmployeeData();
    })
    .catch(() => snackbarStore.openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' }))
    .finally(() => drawerStore.close())
);
</script>
