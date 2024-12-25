<template>
  <v-card variant="flat">
    <c-modal-header @close-icon-clicked="drawerStore.close">
      <template #header>
        <h3>Добавить задание</h3>
      </template>
    </c-modal-header>
    <v-card-text>
      Заполняя данную форму, Вы соглашаетесь с условиями к заданию и обязуетесь выполнить его в установленные сроки
    </v-card-text>
    <v-combobox
      v-model="task"
      class="ml-3 mr-3"
      label="Выберите задание"
      item-title="name"
      item-value="id"
      :items="allTasks"
    />
    <v-card-text class="mb-3">
      Если задание предполагает более 1 участника - укажите состав команды, не указывая себя (иначе оставьте поле
      пустым)
    </v-card-text>
    <v-row
      v-for="(item, index) in selectedPeople"
      :key="item.id"
      class="ml-3 mr-3"
      align="center"
    >
      <v-combobox
        v-model="item.employeeData"
        class="pa-0 ma-0 mr-2"
        label="Выберите участника команды"
        item-title="fullName"
        item-value="id"
        :items="allTrainees"
      />
      <v-btn
        v-if="index === 0"
        class="ma-1 mb-7"
        icon="mdi-plus"
        density="compact"
        @click="selectedPeople.push({ id: Math.random() + 1, employeeData: null })"
      />
      <v-btn
        v-if="selectedPeople.length > 1 && index > 0"
        class="ma-1 mb-7"
        icon="mdi-trash-can-outline"
        density="compact"
        @click="selectedPeople.splice(index, 1)"
      />
    </v-row>
    <v-card-text>
      Выберите лидера команды
    </v-card-text>
    <v-combobox
      v-model="leader"
      class="ml-3 mr-3"
      label="Выберите лидера команды"
      item-title="fullName"
      item-value="id"
      :items="selectedPeopleForLeader"
    />
    <v-card-actions class="pa-6">
      <v-spacer/>
      <v-btn
        density="comfortable"
        text="Добавить"
        variant="outlined"
        :disabled="isLoading || !task"
        @click="confirmAddingTask"
      />
      <v-btn
        density="comfortable"
        text="Отмена"
        variant="outlined"
        @click="drawerStore.close"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import { useBaseModalStore } from '@/components/common/ui/widgets/store/BaseModalStore';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import { useLoading } from '@/lib/utils/useLoading';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';

const drawerStore = useDrawerStore();
const baseModalStore = useBaseModalStore();
const snackbarStore = useSnackbarStore();
const employeeStore = useEmployeeStore();
const userDataStore = useUserDataStore();

/** Переменная, хранящая статус получения данных с сервера */
const { isLoading, withLoading } = useLoading();

/** Выбранное в комбобоксе задание */
const task = ref<ITask | null>(null);

/** Выбранный лидер команды */
const leader = ref<string | null>(null);

/** Стажеры, доступные для добавления в команду */
const allTrainees = ref<EmployeeData[]>([]);

/** Задания, доступные для выбора в комбобоксе */
const allTasks = ref<ITask[]>([]);

/** Данные пользователя */
const userData = ref<EmployeeData>();

/** Стажеры, доступные для выбора лидером команды */
const selectedPeopleForLeader = ref<(EmployeeData | null)[]>([]);

/** Выбранные участники команды */
const selectedPeople = ref<SelectedPerson[]>([{ id: Math.random(), employeeData: null }]);

/** Добавление стажера, добавленного в команду, в массив возможных для выбора лидером команды */
watch(
  selectedPeople,
  (newSelectedPeople) => {
    selectedPeopleForLeader.value = [];
    newSelectedPeople.forEach((person) => {
      if (person.employeeData !== null) {
        selectedPeopleForLeader.value.push(person.employeeData);
      }
    });
    selectedPeopleForLeader.value.unshift(userData.value);
  },
  { deep: true }
);

/** Отслеживание значения isConfirmed, если true, выполняется метод addTask */
watch(() => baseModalStore.isConfirmed, (isConfirmed) => isConfirmed && addTask());

/** Получение массивов доступных заданий и стажеров с сервера до появления компонента в DOM дереве */
onBeforeMount(() => {
  employeeStore.employeeApi.getAvailableTasks()
    .then((data) => {
      const temp = new Set(employeeStore.employeeData?.trackerTasks.map((item) => item.id));
      allTasks.value = data.practices.filter((item) => !temp.has(item.id));
    })
    .catch(() => snackbarStore.openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' }));

  employeeStore.employeeApi.getAllEmployees()
    .then((data) => {
      const taskAssignableUsers: EmployeeData[] = data.filter(
        (user: EmployeeData) => user.role.name === 'USER_TRAINEE' || user.role.name === 'USER_TUTOR'
      );
      allTrainees.value = taskAssignableUsers.filter((e: EmployeeData) => e.id !== userDataStore.userID);
      userData.value = taskAssignableUsers.find((e: EmployeeData) => e.id === userDataStore.userID);
    })
    .catch((e) => console.error(e));
});

/** Создание массива с ID участников команды на основании массива выбранных участников команды */
const mapSelectedPersonsToTraineeIds = (selectedPersons: SelectedPerson[]): number[] =>
  selectedPersons.filter((person) => person.employeeData !== null).map((person) => person.employeeData!.id);

/** Показ модального окна с предупреждением. Вызывает метод openModal из класса {@link useBaseModalStore} */
const confirmAddingTask = () => baseModalStore.openModal({
  title: 'Предупреждение',
  content: `Вы точно хотите добавить практическое задание "${task.value?.name}"?`,
  hasControls: true,
  modalIconType: 'confirm',
});

/** Метод, отправляющий запрос на сервер о добавлении задания (участники команды и ID задания) */
const addTask = () => {
  const selectedTrainees = mapSelectedPersonsToTraineeIds(selectedPeople.value);
  selectedTrainees.unshift(userDataStore.userID);

  withLoading(
    employeeStore.employeeApi.addTask({
      employees: selectedTrainees,
      task: task.value?.id,
    })
    .then(() => {
      snackbarStore.openSnackbar(`Вы успешно добавили задание "${task.value?.name}".
        Подходите рационально к выполнению задания во избежание просрочек в дальнейшем.`);
      employeeStore.getEmployeeData();
    })
    .catch(() => snackbarStore.openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' }))
    .finally(() => drawerStore.close())
  );
};
</script>
