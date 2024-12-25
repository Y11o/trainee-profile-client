<template>
  <v-card max-width="500">
    <c-modal-header @close-icon-clicked="emit('closeModal')">
      <template #header>Дата и время встречи</template>
    </c-modal-header>
    <div class="custom-calendar ma-4">
      <Calendar
        v-model="meetingDateTime"
        class="show-offset-dates"
        timezone="Europe/Moscow"
        mode="dateTime"
        show-weeknumbers
        is-required
        is24hr
        :min-date="new Date()"
        :attributes="attrs"
      />
    </div>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text="Подтвердить"
        class="controls"
        density="compact"
        variant="outlined"
        @click="confirmDateTime"
      />
      <v-btn
        text="Отмена"
        class="controls"
        density="compact"
        variant="outlined"
        @click="emit('closeModal')"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { toISO } from '@/lib/utils';
import { DatePicker as Calendar } from 'v-calendar';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';

/**
 * @property {IMeetingInfo} meetingInfo Информация о митинге
 */
 const props = defineProps<{
  meetingInfo: IMeetingInfo,
}>();

const emit = defineEmits(['closeModal', 'confirmDateTime']);

/** Выбранное время встречи */
const meetingDateTime = ref(new Date(props.meetingInfo.dateTime));

const confirmDateTime = () => emit('confirmDateTime', toISO(meetingDateTime.value));

const attrs = ref<object[]>([
  {
    key: 'prevDate',
    highlight: {
      fillMode: 'outline'
    },
    dates: props.meetingInfo.dateTime,
  }
]);
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.controls {
  background: $lk-gr-background;
  border: 1px solid $lk-gr-border;
}

.custom-calendar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 7.2px 0;

  & :deep(.vc-light) {
    --vc-weekday-color: $lk-black;
    --vc-weeknumber-color: #0987FC; //тут почему-то не работают переменные
    --vc-header-title-color: #0987FC; //тут почему-то не работают переменные
  }

  & :deep(.highlight-today) {
    background: $lk-blue;
  }

  & :deep(.vc-highlight-content-solid) {
    color: $lk-white;
  }

  & :deep(.vc-header) {
    border-bottom: 1px solid $lk-gb-40;
  }

  & :deep(.show-offset-dates) {
    &.vc-monthly .is-not-in-month * {
      opacity: 0.5;
    }
  }
}
</style>
