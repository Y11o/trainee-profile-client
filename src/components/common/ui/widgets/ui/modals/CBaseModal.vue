<template>
  <c-modal-window
    :model-value="isOpen"
    v-bind="componentProps"
    @confirm-action="onConfirm"
    @update:modelValue="closeModal"
  >
    {{ componentProps.content }}
  </c-modal-window>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useBaseModalStore } from '@/components/common/ui/widgets/store/BaseModalStore';
import CModalWindow from '@/components/common/ui/widgets/ui/modals/CModalWindow.vue';

/**
 * Переменная, отвечающая за стор модальных окон ({@link useBaseModalStore})
 */
const baseModalStore = useBaseModalStore();

/**
 * Доступ к переменным isOpen, componentProps из {@link baseModalStore}
 */
const { isOpen, componentProps } = storeToRefs(baseModalStore);

/**
 * Нажатие кннопки "ОК" в модальном окне. Вызывает метод confirmAction из {@link baseModalStore} 
 */
const onConfirm = () => {
  baseModalStore.confirmAction();
  closeModal();
};

/**
 * Вызов метода closeModal из {@link baseModalStore}
 */
const closeModal = () => baseModalStore.closeModal();
</script>