<template>
  <v-menu transition="scale-transition">
    <template #activator="{ props }">
      <c-status-box
        v-bind="props"
        :class="traineeStatus !== 'В отпуске' && traineeStatus !== 'На больничном' ? 'cursor-pointer' : ''"
        :text="traineeStatus === 'Уважительная причина' ? 'Уваж. причина' : traineeStatus"
        :color="findTraineeStatusColor()"
      />
    </template>
    <v-list
      v-if="enabled"
      class="pa-0"
      density="compact"
    >
      <v-list-item
        v-for="item in editedItems"
        :key="item.name"
        class="cursor-pointer"
        :title="item.name"
        @click="handleAttendanceStatusChange(item.value as number)"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CStatusBox from '@/components/common/ui/CStatusBox.vue';

/**
 * @property {number | null} id Идентификатор стажера
 * @property {string} traineeStatus Статус присутствия стажера на митинге
 * @property {boolean} disabled Включена ли возможность выбора статуса
 */
const props = withDefaults(defineProps<{
  id: number | null;
  traineeStatus: string;
  disabled: boolean;
}>(), {
  id: null,
  traineeStatus: 'Выбрать',
  disabled: false,
});

const emit = defineEmits(['changeAttendanceStatus']);

const enabled = computed(() => 
  !props.disabled && props.traineeStatus !== 'В отпуске' && props.traineeStatus !== 'На больничном');

const traineeStatuses = [
  { name: 'Присутствует', value: 1, color: 'green' },
  { name: 'Уважительная причина', value: 2, color: 'green' },
  { name: 'Опоздал', value: 3, color: 'red' },
  { name: 'Отсутствует', value: 4, color: 'red' },
  { name: 'Работает с наставником', value: 5, color: 'green' },
  { name: 'На больничном', value: null, color: 'yellow' },
  { name: 'В отпуске', value: null, color: 'yellow' },
  { name: 'Выбрать', value: null, color: 'blue' },
];

/** Массив статусов, которые могут быть выбраны пользователем */
const editedItems = traineeStatuses.filter((item) => item.value != null);

/** Метод, возвращающий цвет для статуса присутствия выбранного стажера */
const findTraineeStatusColor = () => {
  const currentTraineeStatus = traineeStatuses.find(status => status.name === props.traineeStatus);
  return currentTraineeStatus ? currentTraineeStatus.color : 'blue';
};

const handleAttendanceStatusChange = (statusId: number) => {
  const data = { traineeId: props.id, attendanceStatusId: statusId };
  emit('changeAttendanceStatus', data);
};
</script>

<style scoped lang="scss">
@import "@/styles/colorVars";

:deep(.v-list-item--active) {
  color: $lk-gr-background;
}

:deep(.v-list-item-title) {
  font-size: 13px;
  color: $lk-dark;
}
</style>
