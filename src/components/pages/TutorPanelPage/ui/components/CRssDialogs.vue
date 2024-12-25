<template>
  <v-container
    class="d-flex h-100 pa-0"
    fluid
  >
    <v-row>
      <v-col
        cols="12"
        lg="4"
      >
        <trainee-meetings-table
          class="h-100"
          :meetings-data="rssDialogsData"
          :is-data-received="isDataReceived"
          @select="selectDialog"
          @change-date="changeDialogDate"
        />
      </v-col>
      <v-col
        cols="12"
        lg="8"
      >
        <div class="comment-block d-flex flex-column ga-lg-6 h-100">
          <c-table-container>
            <template #header>
              Комментарий куратора
            </template>
            <div class="comment-block__inner">
              <div class="comment-block__content text-body-2">
                <v-skeleton-loader
                  v-if="!isDataReceived"
                  type="text"
                />
                <div
                  v-else
                  class="comment-block__title"
                >
                  {{ commentsData.tutor.fullName }}
                </div>
                <v-skeleton-loader
                  v-if="!isDataReceived"
                  type="list-item-three-line"
                />
                <div v-if="!isEditOn && isDataReceived">{{ commentsData.tutorComment }}</div>
                <v-textarea
                  v-else
                  v-model="commentsData.tutorComment"
                  no-resize
                  autofocus
                  variant="plain"
                  color="grey"
                  rows="4"
                  hide-details
                  density="compact"
                  :disabled="!isEditOn"
                  @blur="editTutorComment"
                />
              </div>
              <div
                v-if="!isEditOn"
                class="comment-block__actions"
              >
                <v-divider/>
                <v-btn
                  class="ml-n1"
                  icon="mdi-pencil-box-outline"
                  variant="text"
                  density="compact"
                  rounded
                  @click="isEditOn = true"
                />
              </div>
            </div>
          </c-table-container>
          <c-table-container>
            <template #header>
              Комментарий руководства
            </template>
            <div class="comment-block__inner">
              <div class="comment-block__content text-body-2">
                <v-skeleton-loader
                  v-if="!isDataReceived"
                  type="text"
                />
                <div
                  v-else
                  class="comment-block__title"
                >
                  {{ commentsData.head.fullName }}
                </div>
                <v-skeleton-loader
                  v-if="!isDataReceived"
                  type="list-item-three-line"
                />
                <div v-else>{{ commentsData.headComment }}</div>
              </div>
            </div>
          </c-table-container>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { TutorPanelApi } from '@/components/pages/TutorPanelPage/network/TutorPanelApi';
import { RssDialog } from '@/components/pages/TutorPanelPage/models/RssDialogs/RssDialog';
import { RssComments } from '@/components/pages/TutorPanelPage/models/RssDialogs/RssComments';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import TraineeMeetingsTable from '@/components/pages/TutorPanelPage/ui/components/tables/TraineeMeetingsTable.vue';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

const snackbarStore = useSnackbarStore();

const rssApi = new TutorPanelApi('rating_dialog');

/** Переменная, хранящая статус получения данных с сервера */
const isDataReceived = ref<boolean>(false);

/** Переменная, отвечающая за включение/выключение режима редактирования */
const isEditOn = ref<boolean>(false);

/** Переменная, хранящая данные об РСС-диалогах */
const rssDialogsData = ref<RssDialog[]>([]);

/** Переменная, хранящая комментарии к выбранному РСС-диалогу */
const commentsData = ref<RssComments>({
  eventId: null,
  headComment: '',
  head: {
    id: null,
    fullName: ''
  },
  tutorComment: '',
  tutor: {
    id: null,
    fullName: ''
  }
});

/**
 * Метод получения данных об РСС-диалогах. Вызывает метод {@link getRssDialogData}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const fetchRssDialogs = async () => rssApi.getRssDialogData()
  .then((result) => {
    rssDialogsData.value = result.map((item) => new RssDialog(item));
    isDataReceived.value = true;
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось загрузить данные о РСС диалогах. Обновите страницу.',
      { icon: 'error' }
    ));

onBeforeMount(async () => {
  await fetchRssDialogs();
});

/** Метод, вызываемый при нажатии на РСС-диалог и вызывающий {@link fetchComments} для получения комментариев к нему */
const selectDialog = async (item: number) => {
  await fetchComments(item);
};

/** Метод обновления комментария куратора к РСС-диалогу. Вызывает метод {@link editRssTutorComment} */
const editTutorComment = async () => {
  isEditOn.value = false;
  const newCommentData = {
    id: commentsData.value.eventId,
    text: commentsData.value.tutorComment
  } as INewRssDialogTutorComment;
  await rssApi.editRssTutorComment(newCommentData);
};

/**
 * Метод обновления даты РСС-диалога. Вызывает метод {@link changeRssDialogDate}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const changeDialogDate = async (item: { eventId: number, dateTime: string }) =>
  rssApi.changeRssDialogDate(item as INewRssDialogDate)
    .then(() => fetchRssDialogs())
    .catch(() =>
      snackbarStore.openSnackbar('Не удалось изменить время встречи. Обновите страницу.',
        { icon: 'error' }
      ));

/**
 * Метод получения комментариев к РСС-диалогу. Вызывает метод {@link getRssCommentsData}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const fetchComments = async (eventId: number) => rssApi.getRssCommentsData(eventId)
  .then((result) => {
    commentsData.value = new RssComments(result);
  })
  .catch(() =>
    snackbarStore.openSnackbar('Не удалось загрузить комментарии к встрече. Обновите страницу.',
      { icon: 'error' }
    ));
</script>

<style scoped lang="scss">
.comment-block {
  &__inner {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 36px;
    max-height: 145px;
  }

  &__content {
    flex: 1 1 auto;
    overflow-y: auto;
    margin: 8px 16px 6px 16px;
  }

  &__title {
    margin-bottom: 2px;
    font-weight: 500;
  }

  &__actions {
    margin: 0 16px 4px 16px;
  }
}
</style>
