<template>
  <v-navigation-drawer
    :model-value="isOpen"
    location="right"
    width="450"
    temporary
    :touchless="!isOpen"
    @update:modelValue="drawerStore.close"
  >
    <component
      :is="componentData.component.instance"
      v-bind="componentData.props"
      :key="componentData.component.name"
      v-on="componentEmits"
    />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useDrawerStore } from '@/components/common/ui/widgets/store/DrawerStore';

/**
 * Переменная, отвечающая за стор панели справа ({@link useDrawerStore})
 */
const drawerStore = useDrawerStore();

/**
 * Доступ к переменным isOpen, componentData и componentEmits из {@link useDrawerStore}
 */
const { isOpen, componentData, componentEmits } = storeToRefs(drawerStore);
</script>
