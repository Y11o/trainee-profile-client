<template>
  <tr
    class="cursor-pointer"
    @click="rowExpandApi.toggleExpand(rowExpandApi.internalItem)"
  >
    <td>{{ traineeAttendance.trainee }}</td>
    <td>{{ traineeAttendance.traineeGroupNumber }}</td>
    <td>{{ traineeAttendance.weekSummaryDebt }}</td>
    <td>
      <v-menu
        v-model="isAbsenteeReasonModal"
        width="320"
        location="bottom"
        eager
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <v-chip
            v-bind="props"
            class="table-chip"
            :text="traineeAttendance.absenteeReason?.name || 'Выбрать'"
            :ripple="false"
            :class="`colors-${statuses.get(String(traineeAttendance.absenteeReason?.name)) || 'blue'}`"
          />
        </template>
        <v-list max-width="200">
          <v-list-item
            v-for="item in attendanceAbsenteeReasonList"
            :key="item.id"
            density="compact"
            :title="item.name"
            @click="selectedAbsenteeReasonId = item.id"
          >
          </v-list-item>
        </v-list>
      </v-menu>
    </td>
    <td>
      <v-form ref="tutorCommentForm">
        <v-textarea
          v-model.trim="tutorCommentFormValue.commentValue"
          density="compact"
          variant="plain"
          max-width="90%"
          placeholder="Добавить комментарий"
          rows="1"
          clearable
          hide-details
          hide-spin-buttons
          autoGrow
          :max-rows="isExpanded ? 6 : 1"
          @click.stop
        />
      </v-form>
    </td>
    <td>
      <v-icon :icon="isExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useFocusWithin } from '@vueuse/core';
import { TraineeAttendanceModel } from '@/components/pages/TutorPanelPage/models/AttendanceCheck/TraineeAttendanceModel';
import { TutorPanelApi } from '@/components/pages/TutorPanelPage/network/TutorPanelApi';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';

const props = defineProps<{
  item: TraineeAttendanceModel;
  attendanceCheckApi: TutorPanelApi;
  attendanceAbsenteeReasonList: IAttendanceAbsenteeReason[];
  rowExpandApi: {
    toggleExpand: (args: any) => any;
    isExpanded: (args: any) => any;
    internalItem: any;
  };
}>();

const snackbarStore = useSnackbarStore();

const traineeAttendance = ref<TraineeAttendanceModel>({ ...props.item });

const isAbsenteeReasonModal = ref<boolean>(false);

const selectedAbsenteeReasonId = ref<number | null>(props.item.absenteeReason?.id || null);

const tutorCommentForm = ref<HTMLFormElement>();

/**
 * @property {string | null} commentValue - текущее model-value v-textarea
 * @property {string | null} snapshot - копия commentValue, копирование происходит
 * на моменте фокуса v-textarea для выполнения editTutorComment только в случае изменения значения
 */
const tutorCommentFormValue = ref<{
  commentValue: string | null;
  snapshot: string | null;
}>({
  commentValue: props.item.tutorComment || '',
  snapshot: props.item.tutorComment || '',
});

const { focused: isTutorCommentFormFocused } = useFocusWithin(tutorCommentForm);

const isExpanded = computed(() => props.rowExpandApi.isExpanded(props.rowExpandApi.internalItem));

watch(isTutorCommentFormFocused, () => {
  if (isTutorCommentFormFocused.value) {
    tutorCommentFormValue.value.snapshot = tutorCommentFormValue.value.commentValue;
  } else if (
    tutorCommentFormValue.value.commentValue !== null &&
    tutorCommentFormValue.value.commentValue !== tutorCommentFormValue.value.snapshot
  ) {
    editTutorComment(tutorCommentFormValue.value.commentValue);
  }
});

watch(
  () => props.item,
  (item) => Object.assign(traineeAttendance.value, item),
  { deep: true, immediate: true }
);

watch(selectedAbsenteeReasonId, () => {
  isAbsenteeReasonModal.value = false;
  if (selectedAbsenteeReasonId.value) {
    editAbsenteeReason(selectedAbsenteeReasonId.value);
  }
});

const editTutorComment = (comment: string) => {
  props.attendanceCheckApi.editAttendanceTutorComment(props.item.id, comment)
    .catch(() => {
      tutorCommentFormValue.value.commentValue = props.item.tutorComment;
      snackbarStore.openSnackbar('Не удалось изменить комментарий. Повторите попытку.', { icon: 'error' });
    });
};

const editAbsenteeReason = (absenteeReasonId: number) => {
  const showError = () => snackbarStore.openSnackbar('Не удалось указать причину. Повторите попытку.', { icon: 'error' });

  const attendanceAbsenteeReason = props.attendanceAbsenteeReasonList.find((item) => item.id === absenteeReasonId);

  if (!attendanceAbsenteeReason) {
    showError();
    return;
  }

  traineeAttendance.value.absenteeReason = attendanceAbsenteeReason;

  props.attendanceCheckApi.editAttendanceAbsenteeReason(traineeAttendance.value.id, absenteeReasonId)
    .catch(() => {
      traineeAttendance.value.absenteeReason = null;
      showError();
    });
};

const statuses = new Map([
  ['В отпуске', 'yellow'],
  ['На больничном', 'yellow'],
  ['Отработка', 'green'],
  ['Другое', 'red'],
]);
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

.table-chip {
  display: flex;
  justify-content: center;
  width: 125px;
  height: 26px;
  font-weight: 500;
  border-radius: 8px;
}

:deep(.v-field__input) {
  font-size: 14px;
}

:deep(.v-field__clearable) {
  padding: 0 !important;
  align-items: center !important;
}
</style>
