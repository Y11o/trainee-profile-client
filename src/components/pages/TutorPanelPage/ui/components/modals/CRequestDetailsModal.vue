<template>
  <v-card
    class="d-flex flex-column px-10 py-8"
    width="500px"
  >
    <div class="d-flex flex-row justify-space-between mt-3 mb-2 font-weight-medium">
      <span>ФИО</span>
      <span>{{ requestDetails.trainee.fullName }}</span>
    </div>
    <v-divider class="line" />
    <div class="d-flex flex-row justify-space-between mt-3 mb-2 font-weight-medium">
      <span>Номер группы:</span>
      <span>{{ requestDetails.groupNumber }}</span>
    </div>
    <v-divider class="line" />
    <div class="d-flex flex-row justify-space-between mt-3 mb-2 font-weight-medium">
      <span>Дата запроса:</span>
      <span>{{ requestDetails.date.toLocaleDateString('ru') }}</span>
    </div>
    <v-divider class="line" />
    <span class="mt-3 mb-2">Запрос стажёра: {{ requestDetails.type }}</span>
    <span class="mt-3 mb-1 font-weight-medium">Примечание:</span>
    <div class="note-container px-3 py-3 mb-6">{{ requestDetails.note }}</div>
    <div class="d-flex flex-row justify-end ga-2">
      <v-btn
        class="custom-btn"
        variant="outlined"
        color="green"
        height="27px"
        :disabled="requestDetails.isRequestApproved || requestDetails.isRequestRejected"
        @click="markAsApproved"
      >
        Утвердить
      </v-btn>
      <v-btn
        class="custom-btn"
        variant="outlined"
        color="red"
        height="27px"
        :disabled="requestDetails.isRequestApproved || requestDetails.isRequestRejected"
        @click="markAsRejected"
      >
        Отказать
      </v-btn>
    </div>
  </v-card>
</template>

<script setup lang="ts">
/**
 * @property {IRequest} requestDetails Данные о запросе
 */
defineProps<{
  requestDetails: IRequest;
}>();

const emit = defineEmits(['approve', 'reject']);

const markAsApproved = () => emit('approve');

const markAsRejected = () => emit('reject');
</script>

<style lang="scss" scoped>
@import '@/styles/colorVars.scss';

.note-container {
  border: 1px solid $lk-gb-40;
  border-radius: 4px;
  background-color: $lk-gr-background;
}

.custom-btn {
  &:deep(span.v-btn__content) {
    color: $lk-black !important;
    font-size: 13px !important;
  }
}
</style>
