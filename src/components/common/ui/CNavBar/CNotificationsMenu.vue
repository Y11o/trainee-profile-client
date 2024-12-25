<template>
  <v-menu
    eager
    :transition="false"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        class="disabled-hover ml-n4"
        :ripple="false"
      >
        <v-icon
          icon="mdi-bell-outline"
          size="x-large"
        />
        <v-badge
          v-if="unreadCount"
          class="position-absolute mb-6 ml-6"
          :content="unreadCount"
        />
      </v-btn>
    </template>
    <v-card
      rounded="lg"
      :width="smAndUp ? 580 : '100%'"
    >
      <v-data-table-virtual
        class="py-2"
        :height="notifications.length ? 500 : 52"
        :hover="!!notifications.length"
        :mobile="false"
        :items="notifications"
        :no-data-text="'Нет уведомлений'"
      >
        <template #headers/>
        <template #item="{ item }: { item: NotificationModel }">
          <tr
            class="cursor-pointer"
            @click="markAsRead(item)"
          >
            <td class="py-2">
              <span :class="{ 'read-notification': item.isNotificationRead }">
                {{ item.message }}
              </span>
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { NotificationModel } from '@/components/common/models/notification/NotificationModel';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { NotificationApi } from '@/components/common/network/NotificationApi';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';

const { smAndUp } = useDisplay();

const snackbarStore = useSnackbarStore();

const notificationApi = new NotificationApi('/notifications');

const notifications = ref<NotificationModel[]>([]);

const unreadCount = computed(() => notifications.value?.filter((item) => !item.isNotificationRead).length);

const getNotifications = async (): Promise<NotificationModel[] | void> =>
  notificationApi.getNotifications()
    .then((result) => {
      if (result) {
        notifications.value = result.map((e) => new NotificationModel(e));
      }
    })
    .catch(() => snackbarStore.openSnackbar('Не удалось загрузить уведомления. Обновите страницу.',
      { icon: 'error' }
    ));

const markAsRead = (item: NotificationModel) => {
  if (item.isNotificationRead) {
    return;
  }
  item.isNotificationRead = true;
  notificationApi.setNotificationAsRead(item.id)
    .catch(() => {
      item.isNotificationRead = false;
      useSnackbarStore().openSnackbar('Ошибка! Повторите попытку.', { icon: 'error' });
    });
};

onBeforeMount(async () => {
  if (useUserDataStore().isAuthorized) {
    await getNotifications();
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/colorVars";

.notifications-list {
  color: $lk-black !important;
}

.read-notification {
  opacity: 0.4;
}

.v-icon {
  color: $lk-gr;
}

:deep(.v-list-item-subtitle) {
  opacity: 1;
}

:deep(.v-badge__badge) {
  background-color: $lk-blue;
}

:deep(.v-btn__overlay) {
  opacity: 0 !important;
}

tbody > tr:nth-last-child(2) > td,
:deep(.v-data-table-rows-no-data) > td {
  border-bottom: none !important;
}
</style>
