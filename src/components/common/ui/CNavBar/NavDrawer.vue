<template>
  <v-navigation-drawer
    v-model="isDrawerOpened"
    width="272"
    temporary
  >
    <v-list
      class="d-flex flex-column h-100"
      density="compact"
      nav
    >
      <v-list-item
        v-for="item in routesGroup"
        :key="item.title"
        :title="item.title"
        :to="item.route"
      />
      <v-list-item
        v-if="userDataStore.roleIs.isAssistant || userDataStore.roleIs.isCurator"
        class="mt-auto"
        title="ПУ АССИСТЕНТА"
        :to="isDesktop ? '/assistant-panel/certificates' : '/assistant-panel'"
      />
      <v-list-item
        v-if="userDataStore.roleIs.isCurator"
        title="ПУ КУРАТОРА"
        :to="isDesktop ? '/tutor-panel/view-groups' : '/tutor-panel'"
      />
      <v-list-item
        :class="userDataStore.roleIs.isCurator || userDataStore.roleIs.isAssistant? '' : 'mt-auto'"
        prepend-icon="mdi-flip-h mdi-login-variant"
        title="ВЫХОД"
        to="/auth"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';

const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

const userDataStore = useUserDataStore();

/**
 * @param {boolean} modelValue Переменная, отвечающая за показ/скрытие панели в родительском компоненте
 * @param {object[]} routesGroup Массив путей и прилагающихся данных для отображения в навигационной панели
 */
const props = withDefaults(
  defineProps<{
    modelValue: boolean,
    routesGroup: object[]
  }>(),
  {
    modelValue: false,
    routesGroup: () => [],
  },
);

const emit = defineEmits(['update:modelValue']);

/**
 * Переменная-флаг, отвечающая за показ/скрытие навигационной панели
 */
const isDrawerOpened = ref<boolean>(false);

/**
* Отслеживание изменений model-value и установка его значения в isDrawerOpened
*/
watch(() => props.modelValue, (newValue) => isDrawerOpened.value = newValue);

/**
 * Отслеживание изменений isDrawerOpened и эмит его обновленного значения в родительский компонент
 */
watch(isDrawerOpened, (newValue) => emit('update:modelValue', newValue));

/**
 * Установка значения model-value в isDrawerOpened при показе виджета на экране
 */
onMounted(() => isDrawerOpened.value = props.modelValue);
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

:deep(.v-list-item-title) {
  color: $lk-gr;
  font-size: 15px;
}

:deep(.v-list-item--nav .v-list-item-title) {
  font-size: 15px;
}

:deep(.v-list-item--active) {
  color: $lk-blue;
  .v-list-item-title {
    color: $lk-blue;
  }
}
</style>
