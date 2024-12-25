<template>
  <c-table-container>
    <template #header>
      Встречи со стажерами
    </template>
    <div class="pr-2">
      <v-data-table-virtual
        density="compact"
        hide-default-header
        hover
        :loading="!isDataReceived"
        :items="meetingsData"
        :headers="headers"
        :mobile="false"
      >
        <template #item="{ item }: { item: RssDialog }">
          <tr
            class="cursor-pointer"
            @click="onClickItem(item)"
          >
            <td
              :class="item.eventDate === 'Назначить дату' ? 'text-decoration-underline' :  ''"
              @click="onClickEventDate(item)"
            >
              {{ item.eventDate }}
            </td>
            <td>{{ item.employee.fullName }}</td>
            <td>{{ item.employeeRating }}</td>
          </tr>
        </template>
      </v-data-table-virtual>
    </div>
  </c-table-container>
  <v-dialog
    v-model="DateChangeModalShown"
    max-width="500"
  >
    <meeting-date-modal
      @confirm-date-time="onChangeEventDate"
      @close-modal="DateChangeModalShown = false"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { RssDialog } from '@/components/pages/TutorPanelPage/models/RssDialogs/RssDialog';
import MeetingDateModal from '@/components/pages/TutorPanelPage/ui/components/modals/MeetingDateModal.vue';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

/**
 * @property {RssDialog[]} meetingsData Информация об РСС-диалогах
 * @property {boolean} isDataReceived Статус получения данных с сервера
 */
withDefaults(defineProps<{
  meetingsData: RssDialog[],
  isDataReceived: boolean
}>(), {
  meetingsData: () => [],
});

const emit = defineEmits(['select', 'changeDate']);

/** Переменная, отвечающая за показ модального окна с выбором даты */
const DateChangeModalShown = ref<boolean>(false);

const currentMeetingId = ref<number | null>(null);

const onClickItem = (item: RssDialog) => emit('select', item.eventId);

/** Метод, открывающий модальное окно с выбором даты, если у РСС-Диалога отсутствует дата */
const onClickEventDate = (item: RssDialog) => {
  if (item.eventDate === 'Назначить дату') {
    currentMeetingId.value = item.eventId;
    DateChangeModalShown.value = true;
  }
};

/** Метод, который эмитит событие 'changeDate' и закрывает модальное окно */
const onChangeEventDate = (eventDate: Date) => {
  emit('changeDate', { eventId: currentMeetingId.value, dateTime: eventDate });
  DateChangeModalShown.value = false;
};

const headers = [
  { title: 'Дата встречи', value: 'date', align: 'start' },
  { title: 'ФИО стажера', value: 'trainee', align: 'start' },
  { title: 'Рейтинг', value: 'score', align: 'start' },
] as object[];
</script>
