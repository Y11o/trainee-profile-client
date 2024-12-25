<template>
  <v-snackbar
    v-model="isOpen"
    color="grey-lighten-5"
    multi-line
    @update:modelValue="closeSnackbar"
  >
    <v-list-item class="pa-0 ma-0">
      <template #prepend>
        <div>
          <v-icon
            :icon="widgetIcons.get(icon)"
            class="text-h4 mr-2"
            :class="icon"
          />
        </div>
      </template>
      {{ text }}
    </v-list-item>
  </v-snackbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { widgetIcons } from '@/components/common/ui/widgets/constants';

/**
 * Переменная класса {@link useSnackbarStore}
 */
const snackbarStore = useSnackbarStore();

/**
 * Доступ к переменным isOpen, text из класса {@link useSnackbarStore}
 */
const { isOpen, text, icon } = storeToRefs(snackbarStore);
/**
 * Метод закрытия снэкбара. Вызывает метод closeSnackbar из класса {@link useSnackbarStore}
 */
const closeSnackbar = () => snackbarStore.closeSnackbar();
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

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
