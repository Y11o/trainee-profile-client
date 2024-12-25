<template>
  <v-menu transition="scale-transition">
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        v-tooltip="'Добавить курс, задание'"
        icon="mdi-plus"
        variant="text"
        density="compact"
      />
    </template>
    <v-list
      class="pa-0"
      density="compact"
    >
      <v-list-item
        v-for="item in actions"
        :key="item.title"
        class="cursor-pointer"
        :title="item.title"
        @click="onHandleAction(item.type)"
      />
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const emit = defineEmits(['showAddTask', 'showAddCourse']);

/**
 * Массив, содержащий элементы списка с действиями
 */
const actions = [
  { title: 'Добавить курс', type: 'course' },
  { title: 'Добавить задание', type: 'task' },
];

/**
 * Метод, который эмитит тип выбранного действия
 */
const onHandleAction = (type: string) => emit(type === 'course' ? 'showAddCourse' : 'showAddTask');
</script>

<style scoped lang="scss">
@import "@/styles/colorVars";

.v-btn {
  color: $lk-gr;
}

:deep(.v-list-item--active) {
  color: $lk-gr-background;
}

:deep(.v-list-item-title) {
  font-size: 13px;
  color: $lk-dark;
}
</style>
