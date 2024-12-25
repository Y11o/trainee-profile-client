<template>
  <c-table-container>
    <template #header>
      Внутренние встречи
    </template>
    <v-data-table-virtual
      height="320"
      density="compact"
      hide-default-header
      hover
      :loading="!isDataReceived"
      :items="meetingsData"
      :headers="headers"
      :mobile="false"
    >
      <template #item="{ item }: { item: InternalMeetingModel }">
        <tr
          class="cursor-pointer"
          @click="emit('select', item)"
        >
          <td>
            {{ item.timeStarted.split(',')[0] }}
          </td>
          <td>
            {{ item.title }}
          </td>
          <td>
            {{ item.groupNumber }}
          </td>
          <td>
            {{ item.employee.fullName }}
          </td>
          <td>
            <c-status-box
              class="cursor-pointer"
              :text="item.eventStatus.name"
              :color="getMeetingStatusColor(item.eventStatus.name)"
              @click="emit('select', item)"
            />
          </td>
        </tr>
      </template>
    </v-data-table-virtual>
  </c-table-container>
</template>

<script setup lang="ts">
import type { InternalMeetingModel } from '@/components/pages/TutorPanelPage/models/InternalMeetings/InternalMeetingModel';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';
import CStatusBox from '@/components/common/ui/CStatusBox.vue';

/**
 * @property {InternalMeetingModel[]} meetingsData Информация о внутренних встречах
 * @property {boolean} isDataReceived Статус получения данных с сервера
 */
withDefaults(defineProps<{
  meetingsData: InternalMeetingModel[],
  isDataReceived: boolean;
}>(), {
  meetingsData: () => [],
});

const emit = defineEmits(['select']);

/** Метод получения цвета для статуса внутренней встречи */
const getMeetingStatusColor = (meetingStatus: string) => meetingStatuses.get(meetingStatus) || 'blue';

const headers = [
  { title: 'Дата', value: 'timeStarted', align: 'start' },
  { title: 'Тип встречи', value: 'title', align: 'start' },
  { title: 'Группа', value: 'groupNumber', align: 'start' },
  { title: 'ФИО стажера', value: 'fullName', align: 'start' },
  { title: 'Статус', value: 'eventStatus', align: 'start' },
] as object[];

const meetingStatuses = new Map([
  ['Завершено', 'green'],
  ['Запланировано', 'yellow'],
  ['Отменено', 'red'],
]);
</script>
