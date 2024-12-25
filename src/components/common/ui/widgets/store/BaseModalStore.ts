import { defineStore } from 'pinia';

type HasControls = true | 'confirm' | 'none';

/**
 * Данные для модального окна
 * @param {String} title заголовок модального окна
 * @param {String} content основной текст модального окна
 * @param {HasControls} hasControls переменная, отвечающая за показ/скрытие кнопок в модальном окне
 * @param {ModalIconType} modalIconType переменная, отвечающая за тип иконки в модальном окне
 * @param {String} dialogWidth переменная, отвечающая за ширину модального окна
 */
export interface ModalComponentProps {
  title?: string;
  content?: string;
  hasControls?: HasControls;
  modalIconType?: WidgetIconType;
  dialogWidth?: string;
}

export const useBaseModalStore = defineStore('baseModal', {
  /**
   * @param {boolean} [isOpen = false] Переменная, отвечающая за показ/скрытие модального окна
   * @param {boolean} [isConfirmed = false] Переменная, отвечающая за нажатие кнопки "ОК" в модальном окне
   * @param {ModalComponentProps} [componentProps = {} as ModalComponentProps] Данные для модального окна
   */
  state: () => ({
    isOpen: false,
    isConfirmed: false,
    componentProps: {} as ModalComponentProps,
  }),
  actions: {
    /**
     * Метод открытия модального окна
     * @param {ModalComponentProps} newComponentProps пропсы для модального окна
     */
    openModal(newComponentProps: ModalComponentProps) {
      this.isOpen = true;
      this.isConfirmed = false;
      Object.assign(this.componentProps, newComponentProps);
    },

    /**
     * Метод подтверждения нажатия на кнопку "ОК"
     */
    confirmAction() {
      this.isConfirmed = true;
    },

    /**
     * Метод закрытия модального окна
     */
    closeModal() {
      this.isOpen = false;
    },
  },
});
