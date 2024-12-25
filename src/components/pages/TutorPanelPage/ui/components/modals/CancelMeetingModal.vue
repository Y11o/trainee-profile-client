<template>
  <v-card>
    <c-modal-header @close-icon-clicked="emit('closeModal')">
      <template #header>Предупреждение</template>
    </c-modal-header>
    <div class="w-100 d-flex flex-column justify-center pa-3 ga-2">
      <span>Вы точно хотите отменить митинг:</span>
      <span class="font-weight-bold">{{ meetingDetails }}?</span>
    </div>
    <div class="w-100 d-flex justify-end pa-3 ga-2">
      <v-btn
        class="certificate-info__button"
        variant="outlined"
        @click="emit('confirm')"
      >
        ОК
      </v-btn>
      <v-btn
        class="certificate-info__button"
        variant="outlined"
        @click="emit('closeModal')"
      >
        ОТМЕНА
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';

/**
 * @property {string} meetingDetails Данные о встрече
 */
defineProps<{
  meetingDetails: string;
}>();

const emit = defineEmits(['confirm', 'closeModal']);
</script>

<style scoped lang="scss">
@import "src/styles/colorVars";

.certificate-info__button {
  width: 142px;
  height: 32px;
  background: $lk-gr-background;
  border: 1px solid $lk-gr-border;
}
</style>
