<template>
  <v-card
    variant="flat"
    class="h-100"
  >
    <c-modal-header @close-icon-clicked="drawerStore.close">
      <template #header>
        <h3>Завершить курс и отправить сертификат</h3>
      </template>
    </c-modal-header>
    <v-card-text>
      Если вы прошли курс <span class="font-weight-medium">"{{ task.name }}",</span> то
      необходимо загрузить сертификат о его успешном завершении.
    </v-card-text>
    <v-card-text>
      <v-file-input
        v-model="loadedFile"
        variant="outlined"
        prepend-icon=""
        prepend-inner-icon="mdi-folder-open"
        density="compact"
        label="Загрузить сертификат"
        hide-details
      />
    </v-card-text>
    <v-card-text class="d-flex">
      <v-spacer/>
      <div class="d-flex ga-2">
        <v-btn
          variant="outlined"
          density="comfortable"
          :disabled="!loadedFile || isLoading"
          @click="onConfirm"
        >
          Завершить
        </v-btn>
        <v-btn
          variant="outlined"
          density="comfortable"
          @click="drawerStore.close"
        >
          Отмена
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useBaseModalStore } from '@/components/common/ui/widgets/store/BaseModalStore';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import type { ProgressTrackerModel } from '@/components/pages/MainPage/models/progressTracker/ProgressTrackerModel';
import { useLoading } from '@/lib/utils/useLoading';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';

/**
 * @param {ProgressTrackerModel} task Данные о задании (теоретический курс)
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

/** Переменная, содержащая сертификат о завершении теоретического курса */
const loadedFile = ref<File>();

/** Отслеживание значения isConfirmed, если true, выполняется метод onConfirmModal */
watch(() => baseModalStore.isConfirmed, (isConfirmed) => isConfirmed && onConfirmModal());

/** Показ модального окна с предупреждением. Вызывает метод openModal из класса {@link useBaseModalStore} */
const onConfirm = () => baseModalStore.openModal({
  title: 'Предупреждение',
  content: 'Вы точно хотите завершить курс?',
  hasControls: true,
  modalIconType: 'confirm',
  dialogWidth: '426',
});

/**
 * Метод, отправляющий запрос о завершении теоретического курса с ID курса, ID стажера и сертификатом о завершении.
 * В случае успеха эмитит success с названием курса, в противном - failure
 */
const onConfirmModal = () => {
  const formData = new FormData();

  if (props.task && loadedFile.value) {
    formData.append('file', loadedFile.value);
    formData.append('employeeTaskId', `${props.task.id}`);
  }

  withLoading(
    employeeStore.employeeApi.completeCourse(formData)
      .then(() => {
        snackbarStore.openSnackbar(`Вы успешно завершили курс "${props.task.name}".`);
        employeeStore.getEmployeeData();
      })
      .catch(() => snackbarStore.openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' }))
      .finally(() => drawerStore.close())
  );
};
</script>
