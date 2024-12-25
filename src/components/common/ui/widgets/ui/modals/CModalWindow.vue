<template>
  <v-dialog
    persistent
    :model-value="modelValue"
    :width="dialogWidth || 'auto'"
    @update:model-value="updateModelValue"
  >
    <v-card class="text-body-2">
      <c-modal-header @close-icon-clicked="onCloseModal">
        <template #header>
          <h3>{{ title }}</h3>
        </template>
      </c-modal-header>
      <v-card-text class="px-3 pt-1 pb-4">
        <div
          class="d-flex"
          :class="{'mb-4': !$slots.content}"
        >
          <v-icon
            v-if="modalIconType"
            class="text-h4 mr-2"
            :icon="widgetIcons.get(modalIconType)"
            :class="modalIconType"
          />
          <span class="mt-1">
            <slot />
          </span>
        </div>
        <slot name="content" />
        <div class="d-flex align-end mt-3">
          <slot name="bottom" />
          <slot name="controls">
            <v-spacer />
            <v-btn
              v-if="hasControls !== 'none'"
              class="controls"
              density="compact"
              :text="confirmBtnText || 'OK'"
              :disabled="disabled"
              @click="onConfirmClicked"
            />
            <v-btn
              v-if="hasControls"
              class="controls ml-1"
              density="compact"
              :text="cancelBtnText || 'ОТМЕНА'"
              @click="onCloseModal"
            />
          </slot>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';
import { widgetIcons } from '@/components/common/ui/widgets/constants';
import type { ModalComponentProps } from '@/components/common/ui/widgets/store/BaseModalStore';

/**
 * @param {Boolean} [modelValue = false] - отвечает за открытие/закрытие окна
 * @param {String} [title = ''] - название модального окна
 * @param {true | 'confirm' | 'none'} [hasControls = true] - отображаемые кнопки контроля: обе, кнопка подтверждения или никакие
 * @param {String} [dialogWidth = 'auto'] - ширина окна
 * @param {String} [confirmBtnText = 'OK'] - текст кнопки подтверждения
 * @param {String} [cancelBtnText = 'ОТМЕНА'] - текст кнопки отмены
 * @param {'error' | 'warning' | 'confirm' | 'info'} [modalIconType = undefined] - отображает соответствующую иконку рядом с описанием
 * @param {Boolean} [stayOnConfirmBtnClick = false] - позволяет окну оставаться открытым при нажатии на кнопку подтверждения
 */
const props = withDefaults(defineProps<ModalComponentProps & {
  modelValue: boolean;
  confirmBtnText?: string;
  cancelBtnText?: string;
  stayOnConfirmBtnClick?: boolean;
  disabled?: boolean
}>(), {
  title: '',
  hasControls: true
});

const emit = defineEmits(['update:modelValue', 'confirmAction', 'onCloseModal']);

/**
 * Метод эмита model-value
 * @param {boolean} value обновленное значение
 */
const updateModelValue = (value: boolean) => emit('update:modelValue', value);

/**
 * Метод закрытия модального окна. Вызывает метод {@link updateModelValue}
 */
const onCloseModal = () => {
  updateModelValue(false);
  emit('onCloseModal');
};

/**
 * Метод нажатия кнопки подтверждения действия в модальном окне. Эмитит событие 'confirmAction' и закрывает модальное окно
 */
const onConfirmClicked = () => {
  emit('confirmAction');
  if (!props.stayOnConfirmBtnClick) {
    updateModelValue(false);
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.header {
  background: linear-gradient(180deg, rgba(242, 242, 242, 0) 0%, $lk-gb-40 100%);
  color: $lk-dark;

  &__icon {
    color: $lk-gr;
  }
}

.controls {
  background: $lk-gr-background;
  border: 1px solid $lk-gr-border;
}

.warning, .confirm {
  color: $lk-yellow;
}

.error {
  color: $lk-red;
}

.info {
  color: $lk-info;
}
</style>
