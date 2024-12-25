<template>
  <c-table-container>
    <template #header>
      Подробности митинга
    </template>
    <div class="meeting-info d-flex align-end flex-column">
      <v-skeleton-loader
        v-if="!isDataReceived"
        class="w-100"
        type="list-item-three-line"
      />
      <div
        v-if="meetingInfo.id != null && isDataReceived"
        ref="topContainer"
        class="w-100 mt-2 mb-4 pl-2 overflow-auto text-body-2"
        :style="{ height: detailsHeight + 'px' }"
      >
        <p class="font-weight-medium">{{ meetingInfo.details }}</p>
        <p>
          Ссылка на задачу в JIRA:
          <a
            :href="meetingInfo.jiraLink"
            target="_blank"
          >
            {{ meetingInfo.jiraLink }}
          </a>
        </p>
        <editable-link
          text="Ссылка на митинг:"
          :link="meetingInfo.videoCallLink"
          @on-edit-link="onUpdateVideoCallLink"
        />
        <editable-link
          text="Запись митинга:"
          :link="meetingInfo.videoCallRecordLink"
          @on-edit-link="onUpdateVideoCallRecordLink"
        />
      </div>
      <div
        class="w-100 mt-lg-auto mt-lg-0"
        :class="{ 'mt-4': !meetingInfo.id }"
        ref="bottomContainer"
      >
        <div class="d-flex flex-wrap justify-center ga-3 mb-4 px-3">
          <v-btn
            v-for="label in meetingActionsLabels"
            :key="label"
            class="meeting-info__button"
            density="compact"
            :text="label"
            :disabled="meetingInfo.id === null || !isDataReceived"
            @click="handleButtonClick(label)"
          />
        </div>
        <div class="meeting-info__comment d-flex align-center px-2">
          <p class="font-weight-medium text-body-2">Примечание куратора</p>
        </div>
        <v-skeleton-loader
          v-if="!isDataReceived"
          type="text"
        />
        <div
          v-else
          class="meeting-info__description mx-4 overflow-auto text-body-2"
        >
          <div
            v-if="!isEditOn"
            class="mt-2"
          >
            {{ meetingInfo.description }}
          </div>
          <v-textarea
            v-else
            v-model="description"
            no-resize
            autofocus
            variant="plain"
            color="grey"
            rows="3"
            hide-details
            density="compact"
            :disabled="!isEditOn"
            @blur="onUpdateDescription"
          />
        </div>
        <v-btn
          v-if="!isEditOn"
          class="ml-4 mb-4"
          icon="mdi-pencil-box-outline"
          variant="text"
          density="compact"
          :disabled="meetingInfo.id === null || !isDataReceived"
          @click="isEditOn = true"
        />
      </div>
    </div>
  </c-table-container>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import EditableLink from '@/components/pages/TutorPanelPage/ui/components/EditableLink.vue';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

/**
 * @property {IMeetingInfo} meetingInfo Информация о митинге
 * @property {boolean} isDataReceived Статус получения данных с сервера
 */
const props = defineProps<{
  meetingInfo: IMeetingInfo,
  isDataReceived: boolean
}>();

const emit = defineEmits(['updateVideoCall', 'changeDate', 'cancelMeeting', 'changeTutor']);

/** Переменная, отвечающая за включение/выключение режима редактирования */
const isEditOn = ref<boolean>(false);

/** Переменная, хранящая текущий текст примечания куратора */
const description = ref<string>('');

/** Переменная, хранящая длину блока с информацией о митинге */
const detailsHeight = ref<number>(0);

/** Переменная, отвечающая за блок с информацией о митинге */
const topContainer = ref<HTMLElement | null>(null);

/** Переменная, отвечающая за блок с примечанием куратора */
const bottomContainer = ref<HTMLElement | null>(null);

let resizeObserver: ResizeObserver | null = null;

watch(() => props.meetingInfo.description, () => description.value = props.meetingInfo.description);

onMounted(() => {
  calculateDetailsHeight();
  resizeObserver = new ResizeObserver(calculateDetailsHeight);

  if (bottomContainer.value) {
    resizeObserver.observe(bottomContainer.value);
  }
});

onUnmounted(() => {
  if (resizeObserver && bottomContainer.value) {
    resizeObserver.unobserve(bottomContainer.value);
  }
});

/** Метод, вычисляющий длину блока информации о митинге в зависимости от длины блока комментария */
const calculateDetailsHeight = () => {
  if (topContainer.value && bottomContainer.value) {
    detailsHeight.value = 324 - bottomContainer.value.clientHeight;
  }
};

/** Метод для передачи типа модального окна в родительский компонент */
const handleButtonClick = (label: string): void => {
  if (label === 'Перенести митинг') {
    emit('changeDate');
  }
  if (label === 'Передать митинг') {
    emit('changeTutor');
  }
  if (label === 'Отменить митинг') {
    emit('cancelMeeting');
  }
};

/** Метод обновления ссылки на митинг, эмитит событие 'updateVideoCall' */
const onUpdateVideoCallLink = (newLink: string) => {
  emit('updateVideoCall', { videoCallLink: newLink });
};

/** Метод обновления ссылки на запись митинга, эмитит событие 'updateVideoCall' */
const onUpdateVideoCallRecordLink = (newLink: string) => {
  emit('updateVideoCall', { videoCallRecordLink: newLink });
};

/** Метод обновления примечания куратора, эмитит событие 'updateVideoCall' */
const onUpdateDescription = () => {
  isEditOn.value = false;
  emit('updateVideoCall', { description: description.value });
};

const meetingActionsLabels = ['Перенести митинг', 'Передать митинг', 'Отменить митинг'];
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

.meeting-info {
  height: 100%;

  &__title, &__comment {
    background-color: $lk-gr-background;
    border-bottom: 1px solid $lk-gb-40;
    height: 36px;
  }

  &__title {
    border-radius: 4px 4px 0 0;
  }

  &__comment {
    border-top: 1px solid $lk-gb-40;
  }

  &__description {
    max-height: 80px;
  }

  &__button {
    background: $lk-gr-background;
    border: 1px solid $lk-gr-border;
    font-size: 12px;
  }
}

a {
  color: $lk-blue;
}
</style>
