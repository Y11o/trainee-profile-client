import { defineStore } from 'pinia';

interface SnackbarOptions {
  icon: WidgetIconType;
}

export const useSnackbarStore = defineStore('snackbar', {
  /**
   * @param {boolean} [isOpen = false] Переменная, отвечающая за показ/скрытие снэкбара
   * @param {String} [text = 'Успех'] Текст в снэкбаре
   */
  state: () => ({
    isOpen: false,
    text: 'Успех',
    icon: 'info' as WidgetIconType,
  }),
  actions: {
    /**
     * Метод показа снэкбара
     * @param {String} text  текст снэкбара
     */
    openSnackbar(text: string, options: SnackbarOptions = { icon: 'info' }) {
      this.isOpen = true;
      this.text = text;
      this.icon = options.icon;
    },

    /**
     * Метод скрытия снэкбара
     */
    closeSnackbar() {
      this.isOpen = false;
    },
  },
});
