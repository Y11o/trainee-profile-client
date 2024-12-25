<template>
  <c-table-container>
    <template #header>
      Участники (группа №{{ meetingMembers.groupNumber }})
    </template>
    <v-data-table-virtual
      density="compact"
      height="352"
      hide-default-header
      hover
      :loading="!isDataReceived"
      :items="meetingMembers.trainees"
      :headers="headers"
      :mobile="false"
    >
      <template #item="{ item }">
        <tr>
          <td>{{ item.fullName }}</td>
          <td>
            <attendance-status-select
              :id="item.id"
              :trainee-status="item.traineeStatus"
              :disabled="!isDataReceived"
              @change-attendance-status="onChangeAttendanceStatus"
            />
          </td>
        </tr>
      </template>
    </v-data-table-virtual>
  </c-table-container>
</template>

<script setup lang="ts">
import CTableContainer from '@/components/common/ui/CTableContainer.vue';
import AttendanceStatusSelect from '@/components/pages/TutorPanelPage/ui/components/AttendanceStatusSelect.vue';

/**
 * @property {IMeetingMembers} meetingMembers Информация об участниках митинга
 * @property {boolean} isDataReceived Статус получения данных с сервера
 */
defineProps<{
  meetingMembers: IMeetingMembers;
  isDataReceived: boolean
}>();

const emit = defineEmits(['select']);

const onChangeAttendanceStatus = (data: IMeetingMember) => {
  emit('select', data);
};

const headers = [
  { title: 'ФИО стажера', value: 'member', align: 'start' },
  { title: 'Статус стажера', value: 'status', align: 'start' },
] as object[];
</script>
