<template>
  <v-container
    class="h-100 d-flex flex-column flex-lg-row pa-0 ga-lg-6"
    fluid
  >
    <template v-if="!isLoading && groupsData?.length">
      <v-tabs
        v-model="groupTabId"
        class="border-t ml-lg-n6 mb-2"
        color="primary"
        :class="{ 'border-none': isDesktop }"
        :direction="isDesktop ? 'vertical' : 'horizontal'"
      >
        <v-tab
          v-for="item of groupsData"
          :key="item.id"
          class="v-tabs-item"
          slim
          :value="item.id"
          :text="`${item.groupNumber}`"
          :min-width="isDesktop ? 40 : 84"
          :width="isDesktop ? 52 : 84"
          :ripple="false"
        />
      </v-tabs>
      <v-tabs-window v-model="groupTabId">
        <v-tabs-window-item
          v-for="item of groupsData"
          :key="item.id"
          :value="item.id"
          :transition="false"
          :reverse-transition="false"
          eager
        >
          <v-card
            v-show="groupTabId === item.id"
            flat
          >
            <div class="py-3 pl-2 pl-lg-0 pt-lg-0 pb-lg-2 text-body-2 font-weight-medium">
              <span class="group-name">Грyппа №{{ item.groupNumber }}, </span>
              <span> {{ item.videoCallTime }}</span>
            </div>
            <v-row>
              <v-col
                cols="12"
                lg="6"
              >
                <notifications-table
                  :items="groupsNotifications.get(item.id)?.items"
                  :tutorPanelApi="tutorPanelApi"
                  :is-data-received="isDataReceived"
                  @load-more="(done) => loadMoreGroupNotifications(item.id, done)"
                />
              </v-col>
              <v-col
                cols="12"
                lg="6"
              >
                <group-members-table
                  :group-data="item"
                  :is-data-received="isDataReceived"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <v-card
      v-else
      class="w-100 h-100"
      flat
      :class="{ 'ml-13 mt-7': isDesktop }"
    >
      <v-row>
        <v-col
          cols="12"
          lg="6"
        >
          <notifications-table
            :tutorPanelApi="tutorPanelApi"
            @load-more="(done) => done('empty')"
          />
        </v-col>
        <v-col
          cols="12"
          lg="6"
        >
          <group-members-table :is-data-received="isDataReceived"/>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { useLoading } from '@/lib/utils/useLoading';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';
import { GroupDataModel } from '@/components/pages/TutorPanelPage/models/ViewGroups/GroupDataModel';
import { GroupNotificationModel } from '@/components/pages/TutorPanelPage/models/ViewGroups/GroupNotificationModel';
import { TutorPanelApi } from '@/components/pages/TutorPanelPage/network/TutorPanelApi';
import GroupMembersTable from '@/components/pages/TutorPanelPage/ui/components/tables/GroupMembersTable.vue';
import NotificationsTable from '@/components/pages/TutorPanelPage/ui/components/tables/NotificationsTable.vue';

const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

const snackbarStore = useSnackbarStore();

const { isLoading, withLoading } = useLoading();

const tutorPanelApi = new TutorPanelApi('');

/** Переменная, хранящая статус получения данных с сервера */
const isDataReceived = ref<boolean>(false);

/** Переменная, хранящая идентификатор группы */
const groupTabId = ref<null | number>(null);

/** Переменная, хранящая данные груп */
const groupsData = ref<GroupDataModel[]>([]);

/** Переменная, хранящая уведомления о действиях участников групп */
const groupsNotifications = ref<
  Map<number, ReturnType<typeof notificationsPagination>>
>(new Map());

/** Пагинация для блока с уведомлениями группы */
const notificationsPagination = () => ({
  page: 1,
  totalPages: 1,
  items: [] as GroupNotificationModel[],
});

onBeforeMount(async () => {
  const data = await withLoading(getGroupsData());

  if (!data) {
    return;
  }

  groupsData.value = data;

  if (data.length) {
    groupTabId.value = groupsData.value[0]?.id;
    groupsData.value.forEach((item) => groupsNotifications.value.set(item.id, notificationsPagination()));
    isDataReceived.value = true;
  } else {
    snackbarStore.openSnackbar('У вас отсутствуют закрепленные за вами группы.', { icon: 'warning' });
  }
});

/** Метод получения большего количества уведомлений группы. Вызывает метод {@link getGroupNotifications}. */
const loadMoreGroupNotifications = async (groupId: number, done: (...args: any[]) => any) => {
  const groupNotifications = groupsNotifications.value.get(groupId);

  if (!groupNotifications || (groupNotifications.page > groupNotifications.totalPages)) {
    done('empty');
    return;
  }

  const data = await getGroupNotifications(groupId, groupNotifications.page);

  if (data) {
    groupNotifications.items.push(...data);
    groupNotifications.page++;
    done('ok');
  } else {
    done('empty');
  }
};

/**
 * Метод получения данных групп. Вызывает метод {@link getGroupsDataByTutor}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const getGroupsData = async (): Promise<GroupDataModel[] | void> =>
  tutorPanelApi.getGroupsDataByTutor()
    .then((result) => result.map((e) => new GroupDataModel(e)))
    .catch(() => snackbarStore.openSnackbar('Не удалось загрузить данные о группах. Обновите страницу.',
      { icon: 'error' }
    ));

/**
 * Метод получения уведомлений группы с учетом пагинации. Вызывает метод {@link getNotificationsByGroupId}.
 * В случае ошибки открывается снекбар с соответствующим сообщением
 */
const getGroupNotifications = (id: number, page: number): Promise<GroupNotificationModel[] | void> =>
  tutorPanelApi.getNotificationsByGroupId(id, page)
    .then((result) => {
      const groupNotifications = groupsNotifications.value.get(id);
      if (groupNotifications) {
        groupNotifications.totalPages = result.totalPages;
      }
      if (result?.content) {
        return result.content.map((e) => new GroupNotificationModel(e));
      }
    })
    .catch(() => snackbarStore.openSnackbar('Не удалось загрузить данные о последних действиях. Обновите страницу.',
      { icon: 'error' }
    ));
</script>

<style scoped lang="scss">
@import '@/styles/colorVars.scss';
.group-name {
  color: $lk-blue;
}

.v-tabs-window {
  width: 100%;
}

.v-tabs-item {
  color: $lk-gr;
}

:deep(.v-tab__slider) {
  height: 4px;

  @media (min-width: 1280px) {
    height: 100%;
    width: 4px;
  }
}

.v-tab--selected {
  color: $lk-blue !important;
}

.empty-block {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $lk-white;
  color: $lk-gr;
}
</style>

