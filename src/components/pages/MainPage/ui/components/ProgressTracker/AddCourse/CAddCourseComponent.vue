<template>
  <v-card
    class="h-100"
    variant="flat"
  >
    <c-modal-header @close-icon-clicked="drawerStore.close">
      <template #header>
        <h3>Добавить курс</h3>
      </template>
    </c-modal-header>
    <v-card-text>
      <v-combobox
        v-model="selectedCourse"
        item-title="name"
        label="Выберите курс"
        hide-details
        :items="coursesData"
      />
    </v-card-text>
    <v-card-actions class="px-4">
      <div class="d-flex w-100">
        <v-spacer/>
        <div class="d-flex align-end">
          <v-btn
            density="comfortable"
            text="Добавить"
            variant="outlined"
            :disabled="isLoading || !selectedCourse"
            @click="onConfirm"
          />
          <v-btn
            density="comfortable"
            text="Отмена"
            variant="outlined"
            @click="drawerStore.close"
          />
        </div>
      </div>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { watch, ref, onBeforeMount } from 'vue';
import { useBaseModalStore } from '@/components/common/ui/widgets/store/BaseModalStore';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import { useLoading } from '@/lib/utils/useLoading';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';

const drawerStore = useDrawerStore();
const baseModalStore = useBaseModalStore();
const snackbarStore = useSnackbarStore();
const employeeStore = useEmployeeStore();
const userDataStore = useUserDataStore();

/** Переменная, хранящая статус получения данных с сервера */
const { isLoading, withLoading } = useLoading();

/** Все доступные к взятию в работу курсы */
const coursesData = ref<ICourse[]>([]);

/** Выбранный для изучения курс */
const selectedCourse = ref<ICourse | null>(null);

/** Отслеживание значения isConfirmed, если true, выполняется метод addCourse */
watch(() => baseModalStore.isConfirmed, (isConfirmed) => isConfirmed && addCourse());

onBeforeMount(async () => await fetchCourses());

/**
 * Метод получения доступных курсов с сервера. В случае успешного запроса фильтрует все курсы, оставляя только те,
 * которые не взяты в работу (т.е. отсутствуют в треке развития)
 */
const fetchCourses = () =>
  employeeStore.employeeApi.getAvailableTasks()
    .then((result) => {
      const temp = new Set(employeeStore.employeeData?.trackerTasks.map((item) => item.id));
      coursesData.value = result.courses.filter((item) => !temp.has(item.id));
    })
    .catch(() => snackbarStore.openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' }));

/**
 * Метод добавления курса в работу. Для добавления курса в работу используются ID пользователя (получается геттером из userDataStore()),
 * а также ID выбранного курса
 */
const addCourse = () => {
  if (!selectedCourse.value) {
    return;
  }

  withLoading(
    employeeStore.employeeApi.addTask({
      employees: [userDataStore.userID],
      task: selectedCourse.value.id,
    })
    .then(() => {
      snackbarStore.openSnackbar(`Вы успешно добавили курс "${selectedCourse.value?.name}".
        Подходите рационально к записи на курс во избежание просрочек в дальнейшем.`);
      employeeStore.getEmployeeData();
    })
    .catch(() => snackbarStore.openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' }))
    .finally(() => drawerStore.close())
  );
};

/** Метод, вызываемый при нажатии кнопки "Добавить". Показывает модалку с подтверждением добавления выбранного курса */
const onConfirm = () => baseModalStore.openModal({
  title: 'Предупреждение',
  content: `Вы точно хотите добавить курс "${selectedCourse.value?.name}"?`,
  hasControls: true,
  modalIconType: 'confirm',
});
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.link-item {
  color: $lk-blue;
}
</style>
