<template>
  <v-autocomplete
    v-model="selectedUserNames"
    :label="isModalWindow && !useUserDataStore().isAuthorized ? 'Авторизуйтесь для возможности брони' : 'ФИО сотрудника'"
    variant="outlined"
    density="compact"
    chips
    closable-chips
    close-on-content-click="false"
    item-value="id"
    :item-title="getFullName"
    :hide-details="true"
    :clearable="true"
    :multiple="isMultiple"
    :items="scheduleStore.allEmployees"
    :disabled="isModalWindow && !checkAccess"
    @update:model-value="handleUpdateModelValue"
  >
    <template #chip="{ props, item }">
      <v-chip
        v-bind="props"
        class="chip"
      >
        {{ getShortName(item.title) }}
      </v-chip>
    </template>
    <template #item="{ props, item }">
      <v-list-item
        v-bind="props"
        :text="item.value"
      />
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { ref, onBeforeMount, watch, computed } from 'vue';
import type { IEmployeesListItemInterface } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';
import { useScheduleRequestsStore } from '@/components/pages/TimeTable/stores/scheduleRequestsStore';
import { useUserDataStore } from '@/components/pages/MainPage/store/userDataStore';

/**
 * @param {boolean} isMultiple Поле, отвечающее за множественный выбор 
 * @param {boolean} isModalWindow Поле, отвечающее за открытие/скрытие модального окна 
 * @param {boolean} isMySchedule Поле, отвечающее за открытие/скрытие расписания стажера
 */
const props = withDefaults(
  defineProps<{
    isMultiple?: boolean;
    isModalWindow?: boolean;
    isMySchedule?: boolean;
    isTrainee?: boolean
  }>(),
  {
    isMultiple: true,
    isModalWindow: false,
    isTrainee: false
  }
);

const emit = defineEmits(['clear-schedule', 'update-selected-users']);

/**
 * Экземпляр класса {@link useScheduleStore}
 */
const scheduleStore = useScheduleStore();

/**
 * Экземпляр класса {@link useScheduleRequestsStore}
 */
const scheduleRequestsStore = useScheduleRequestsStore();

/**
 * Переменная, хранящая идентификаторы выбранных в компоненте сотрудников
 */
const selectedUserNames = ref<number[] | number | null>([]);

const checkAccess = computed(() => useUserDataStore().roleIs.isCurator || useUserDataStore().roleIs.isAssistant);

watch(selectedUserNames, async (newValue) => {
  if (props.isMySchedule) {
    if (newValue !== null) {
      await loadScheduleByUser(); 
      emit('update-selected-users', newValue);
    } 
    emit('clear-schedule', newValue);
  }
});

onBeforeMount(async () => {
  try {
    await scheduleRequestsStore.loadEmployeeNames();

    if (props.isMySchedule) {
      const userId = scheduleStore.currentUserId;
      selectedUserNames.value = userId !== undefined ? userId : null;
    }
  } catch (e) {}
});

/**
 * Настройка отображения имени сотрудника
 */
const getFullName = (employee: IEmployeesListItemInterface) => `${employee.surname} ${employee.name} ${employee.patronymic}`;

/**
 * Настройка отображения сокращенного имени сотрудника
 */
const getShortName = (employeeName: string) => {
  const [surname, name, patronymic] = employeeName.split(' ');
  const formatedPatronymic = patronymic ? `${patronymic[0]}.` : '';
  return `${surname} ${name[0]}.${formatedPatronymic}`;
};

/**
 * Действия при выборе сотрудника в компоненте
 */
const handleUpdateModelValue = () => (props.isModalWindow || props.isMySchedule)? scheduleStore.setEmployee(selectedUserNames.value!) : scheduleStore.setEmployees(selectedUserNames.value!);

/**
 * Метод загрузки расписания выбранного сотрудника
 */
const loadScheduleByUser = async () => await scheduleRequestsStore.fetchScheduleDataByUser(selectedUserNames.value);

/**
 * Отслеживание изменения выбора сотрудника
 */
watch(selectedUserNames, async (newValue) => {
  if (props.isMySchedule) {
    if (newValue !== null) {
      await loadScheduleByUser(); 
    } 
    emit('clear-schedule', newValue);
    scheduleStore.setEmployee(selectedUserNames.value!);
  }
});
</script>

<style lang="scss">
.v-field {
  min-width: 200px !important;

  &__input {
    -v-field-input-padding-top: 0 !important;
    -v-field-input-padding-bottom: 0 !important;
    font-size: 14px !important;
  }
}

.v-field__input {
  max-width: 300px;
  flex-wrap: nowrap;
  overflow-x: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
