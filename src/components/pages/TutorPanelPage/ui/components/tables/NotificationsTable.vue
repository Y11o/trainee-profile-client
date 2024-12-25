<template>
  <c-table-container>
    <template #header>
      Последние действия
    </template>
    <v-skeleton-loader
      v-if="!isDataReceived"
      type="list-item-three-line"
    />
    <v-infinite-scroll
      v-else
      class="rounded"
      :items="notifications"
      :height="322"
      @load="(options) => emit('loadMore', options.done)"
    >
      <v-table class="v-infinite-scroll-table">
        <tbody>
          <tr
            v-for="item in notifications"
            :key="item.id"
          >
            <td>
              <span>{{ formatDateString(item.time).date }}</span>
            </td>
            <td>
              <span>{{ formatDateString(item.time).time }}</span>
            </td>
            <td>
              <span>{{ `${item.trainee}` }}</span>
            </td>
            <td>
              <v-menu
                location="center"
                density="compact"
                transition="scale-transition"
                close-on-content-click
              >
                <template #activator="{ props }">
                  <span
                    class="text-notification"
                    :class="item.isNotificationRead ? 'text-notification--read' : 'text-notification--unread'"
                    v-bind="props"
                  >
                    {{ item.text }}
                  </span>
                </template>
                <v-card
                  class="d-flex flex-column px-4 py-2"
                  width="300px"
                >
                  <span>
                    <span class="text-notification text-notification--unread">{{ `${item.trainee}` }}</span> <span>{{ item.text }}</span>
                  </span>
                  <v-btn
                    v-if="!item.isNotificationRead"
                    class="controls mt-4"
                    text="OK"
                    density="compact"
                    flat
                    @click="markAsRead(item)"
                  />
                </v-card>
              </v-menu>
            </td>
          </tr>
        </tbody>
      </v-table>
      <template
        v-if="!items.length"
        #empty
      >
        <span class="text-body-2">
          Нет данных
        </span>
      </template>
      <template
        v-else
        #empty
      />
    </v-infinite-scroll>
  </c-table-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { GroupNotificationModel } from '@/components/pages/TutorPanelPage/models/ViewGroups/GroupNotificationModel';
import type { TutorPanelApi } from '@/components/pages/TutorPanelPage/network/TutorPanelApi';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

/**
 * @property {GroupNotificationModel[]} items Информация об уведомлениях
 * @property {TutorPanelApi} tutorPanelApi Класс для работы с сетью в рамках ПУ Куратора
 * @property {boolean} isDataReceived Статус получения данных с сервера
 */
const props = withDefaults(defineProps<{
  items: GroupNotificationModel[];
  tutorPanelApi: TutorPanelApi;
  isDataReceived: boolean
}>(), {
  items: () => [],
  isDataReceived: false
});

const emit = defineEmits(['loadMore']);

const notifications = computed(() => [...props.items]);

/**
 * Метод, отвечающий за перевод уведомления в статус прочитанного. Вызывает метод {@link setNotificationAsRead}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const markAsRead = (item: GroupNotificationModel) => {
  item.isNotificationRead = true;
  props.tutorPanelApi.setNotificationAsRead(item.id)
    .catch(() => {
      item.isNotificationRead = false;
      useSnackbarStore().openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' });
    });
};

/** Метод, отвечающий за создание объекта даты-времени из строки */
const formatDateString = (dateString: string) => ({
  date: new Date(dateString).toLocaleDateString('ru-RU'),
  time: new Date(dateString).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
});

</script>

<style lang="scss" scoped>
@import '@/styles/colorVars.scss';

.controls {
  background: $lk-gr-background;
  border: 1px solid $lk-gr;
  cursor: pointer;
}

.v-infinite-scroll-table {
  margin-top: -12px;

  td {
    height: 36px !important;
  }
}
</style>
