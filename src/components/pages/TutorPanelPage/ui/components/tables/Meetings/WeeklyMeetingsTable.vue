<template>
  <c-table-container>
    <template #header>
      <span>Еженедельные митинги</span>
      <v-spacer/>
      <input
        v-model="checkboxChecked"
        type="checkbox"
        @click="onClickCheckbox"
      />
      <span class="text-caption">Показать все митинги</span>
    </template>
    <div class="weekly-meetings h-100 d-flex align-end flex-column rounded-lg">
      <v-data-table-virtual
        density="compact"
        height="352"
        hide-default-header
        hover
        :loading="!isDataReceived"
        :items="displayedMeetings"
        :headers="headers"
        :mobile="false"
      >
        <template #item="{ item }">
          <tr
            class="cursor-pointer"
            :class="item.videoCallStatus === 'Завершено' || item.videoCallStatus === 'Отменено' ? 'opacity-30' : ''"
            @click="emit('select', item)"
          >
            <td>
              {{ item.groupNumber }}
            </td>
            <td>
              {{ (new Date(item.dateTime)).toLocaleString().split(',')[0] }}
            </td>
            <td>
              {{ (new Date(item.dateTime)).toLocaleTimeString('ru-RU').slice(0, -3) }}
            </td>
            <td>
              {{ item.videoCallStatus }}
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
    </div>
  </c-table-container>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { MeetingModel } from '@/components/pages/TutorPanelPage/models/Meetings/MeetingModel';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

/**
 * @property {MeetingModel[]} meetingsData Информация о митингах
 * @property {boolean} isDataReceived Статус получения данных с сервера
 */
const props = withDefaults(defineProps<{
  meetingsData: MeetingModel[],
  isDataReceived: boolean
}>(), {
  meetingsData: () => [],
});

const emit = defineEmits(['select']);

const checkboxChecked = ref<boolean>(false);

const displayedMeetings = computed(() => filterMeetings());

const filterMeetings = () => checkboxChecked.value
  ? props.meetingsData
  : props.meetingsData.filter(meeting =>
    meeting.videoCallStatus !== 'Завершено' && meeting.videoCallStatus !== 'Отменено'
  );

const onClickCheckbox = () => checkboxChecked.value = !checkboxChecked.value;

const headers = [
  { title: 'Группа', value: 'group', align: 'start' },
  { title: 'Дата', value: 'date', align: 'start' },
  { title: 'Время', value: 'time', align: 'start' },
  { title: 'Статус', value: 'status', align: 'start' },
] as object[];
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

.weekly-meetings {
  &__title {
    background-color: $lk-gr-background;
    border-bottom: 1px solid $lk-gb-40;
    border-radius: 4px 4px 0 0;
    height: 36px;
  }
}
</style>
