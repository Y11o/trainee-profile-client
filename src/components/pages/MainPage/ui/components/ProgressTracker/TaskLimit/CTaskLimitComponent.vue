<template>
  <c-modal-window
    v-model="showModal"
    :title="`Вы превысили лимит добавления ${type === 'course' ? 'курсов' : 'заданий'}`"
    modalIconType="error"
    cancel-btn-text="Отмена"
    confirm-btn-text="Отправить"
    dialog-width="426"
    @on-confirm-clicked="onConfirmClicked"
  >
    {{
      type === 'course' ?
        'Стажёр может проходить не более 3 теоретических курсов одновременно. Укажите причину, по которой Вы хотите добавить курс.' :
        'Стажёр может выполнять не более 2 практических заданий одновременно. Укажите причину, по которой Вы хотите добавить задание.'
    }}
    <template #content>
      <v-card-text>
        <v-textarea
          сlass="text-body-2"
          v-model="textarea"
          variant="outlined"
          rows="3"
          hide-details
          no-resize
          :placeholder="getPlaceholderText"
        />
      </v-card-text>
    </template>
  </c-modal-window>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import CModalWindow from '@/components/common/ui/widgets/ui/modals/CModalWindow.vue';

/**
 * @param {'course' | 'task'} [type = 'course'] Тип задания: практическое задание/теоретический курс
 */
const props = withDefaults(
  defineProps<{
    type: 'course' | 'task'
  }>(),
  {
    type: 'course',
  },
);

/**
 * Переменная класса {@link useSnackbarStore}
 */
const snackbarStore = useSnackbarStore();

/**
 * Переменная, отвечающая за показ/скрытие модального окна
 */
const showModal = ref<boolean>(true);

/**
 * Переменная, в которую записывается содержимое текстового поля
 */
const textarea = ref<string>('');

/**
 * Показ снекбара об отправлении заявки на добавление задания куратору. Вызывает метод openSnackbar из класса {@link useSnackbarStore}
 */
const onConfirmClicked = () => snackbarStore.openSnackbar(`Заявка на добавление теоретического ${props.type === 'course' ? 'курса' : 'задания'} отправлена Вашему куратору`);

/**
 * Изменение подсказки для текстового поля в зависимости от типа задания
 */
const getPlaceholderText = (): string => `Укажите причину добавления очередного ${props.type === 'course' ? 'курса' : 'задания'} и нажмите на кнопку «Отправить». Куратор рассмотрит Вашу заявку.`;
</script>

<style scoped lang="scss">
:deep(.v-field__input) {
  padding: 14px;
  font-size: 12px;
}
</style>
