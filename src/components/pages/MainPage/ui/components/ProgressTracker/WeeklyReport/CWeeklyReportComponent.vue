<template>
  <v-card variant="flat">
    <c-modal-header @close-icon-clicked="drawerStore.close">
      <template #header>
        <h3>Утвердить</h3>
      </template>
    </c-modal-header>
    <template v-if="employeeData">
      <v-card-text class="font-weight-medium">
        {{ employeeData.employee.fullName }}
      </v-card-text>
      <v-card-text class="py-0">
        <!-- TODO: Добавить часы -->
        Общее количество затраченных часов: <span class="font-weight-medium">20 часов</span>
      </v-card-text>
      <v-card-text>
        <v-list
          class="mr-0"
          density="compact"
        >
          <v-list-item
            v-for="(item, number) in employeeData.trackerTasks"
            :key="item.id"
            class="pl-2"
          >
            <!-- TODO: Добавить "затраченное время" -->
            {{ number + 1 }}. {{ item.name }}, 2 часа, ({{ item.status }})
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="outlined"
          density="comfortable"
          :disabled="employeeData.trackerTasks.length === 0 || isLoading"
          @click="onConfirm"
        >
          Утвердить
        </v-btn>
        <v-btn
          variant="outlined"
          density="comfortable"
          @click="drawerStore.close"
        >
          Отмена
        </v-btn>
      </v-card-actions>
    </template>
  </v-card>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useBaseModalStore } from '@/components/common/ui/widgets/store/BaseModalStore';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import { useLoading } from '@/lib/utils/useLoading';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';

const emit = defineEmits(['success']);

const drawerStore = useDrawerStore();
const baseModalStore = useBaseModalStore();
const snackbarStore = useSnackbarStore();
const employeeStore = useEmployeeStore();

const { employeeData } = storeToRefs(employeeStore);

/** Переменная, хранящая статус получения данных с сервера */
const { isLoading, withLoading } = useLoading();

/** Отслеживание значения isConfirmed, если true, выполняется метод postReport */
watch(() => baseModalStore.isConfirmed, (isConfirmed) => isConfirmed && postReport());

/** Показ модального окна с предупреждением. Вызывает метод openModal из класса {@link useBaseModalStore} */
const onConfirm = () => baseModalStore.openModal({
  title: 'Предупреждение',
  content: 'Вы точно хотите утвердить выполненную работу?',
  hasControls: true,
  modalIconType: 'confirm',
});

/** Отправление POST-запроса с утвержденными часами */
const postReport = () => {
  if (!employeeData.value) {
    return;
  }

  // TODO: изменить часы на настоящие
  const data = [...employeeData.value.trackerTasks.map((item) => ({ taskId: item.id, timeSpent: 2 }))];

  withLoading(
    employeeStore.employeeApi.sendWeeklyReport(data)
      .then(() => {
        snackbarStore.openSnackbar('Данные о еженедельном отчете успешно отправлены.');
        emit('success');
      })
      .catch(() => snackbarStore.openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' }))
      .finally(() => drawerStore.close())
  );
};
</script>
