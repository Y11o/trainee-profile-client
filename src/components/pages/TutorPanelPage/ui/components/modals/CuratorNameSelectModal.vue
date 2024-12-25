<template>
  <v-card
    class="d-flex flex-column overflow-auto"
    max-width="500"
  >
    <c-modal-header @close-icon-clicked="emit('closeModal')">
      <template #header>
        Передача митинга другому куратору
      </template>
    </c-modal-header>
    <div class="ma-3 d-flex flex-column ga-3">
      <span class="font-weight-bold">{{ meetingDetails }}</span>
      <v-autocomplete
        v-model="selectedTutor"
        label="ФИО куратора"
        variant="outlined"
        density="compact"
        item-value="id"
        item-title="fullName"
        :hide-details="true"
        :clearable="true"
        :items="curatorNames"
      />
    </div>
    <div class="w-100 d-flex justify-end pa-3 ga-2">
      <v-btn
        class="certificate-info__button"
        variant="outlined"
        :disabled="!selectedTutor"
        @click="emit('confirm', selectedTutor)"
      >
        ПОДТВЕРДИТЬ
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
import { ref } from 'vue';

/**
 * @property {string} meetingDetails Данные о встрече
 * @property {IEmployeeTutorPanelData[]} curatorNames Данные о кураторах
 */
defineProps<{
  meetingDetails: string;
  curatorNames: IEmployeeTutorPanelData[];
}>();

const emit = defineEmits(['confirm', 'closeModal']);

const selectedTutor = ref<number | null>(null);
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

