<template>
  <c-table-container>
    <template #header>
      <div class="d-flex h-100 align-center">
        Состав группы &nbsp;
        <span v-if="isDataReceived && groupData?.trainees.length">
          №{{ groupData.groupNumber }} ({{ groupData.trainees.length }} человек(а))
        </span>
        <v-skeleton-loader
          v-else
          width="100"
          type="text"
        />
      </div>
      <v-spacer/>
      <c-color-filters
        allShownFilterText="Все"
        filter-param="actualityStatus"
        :filters="traineeStatuses"
        :items-to-filter="groupData?.trainees"
        @on-apply-filters="filterGroupMembersByActualDate"
      />
    </template>
    <v-data-table-virtual
      density="compact"
      hide-default-header
      hover
      loading-text="Данные загружаются"
      :loading="!isDataReceived"
      :height="isDesktop ? 322 : ''"
      :mobile="false"
      :items="groupMembers"
      :headers="headers"
    >
      <template #item="{ item } : { item: GroupMemberModel }">
        <v-menu
          density="compact"
          transition="scale-transition"
          location="center"
          close-on-content-click
        >
          <template #activator="{ props }">
            <tr v-bind="props">
              <td>
                <span class="nowrap">{{ item.trainee }}</span>
              </td>
              <td>
                <span
                  v-if="item?.actualDate"
                  :class="['indicator', { 'text--negative': !item.isDateActual }]"
                >
                  •&nbsp;
                </span>
                <span>{{ item?.actualDate?.toLocaleDateString('ru') }}</span>
              </td>
              <td>
                <span class="text--underlined">{{ item.actualStatus }}</span>
              </td>
              <td>{{ item.experienceInDays }}</td>
              <td>
                <span
                  class="text--underlined"
                  :class="ratingClass(item.totalRatingPoints)"
                >
                  {{ item.totalRatingPoints }}
                </span>
              </td>
            </tr>
          </template>
          <v-card
            v-if="item.taskName && item.actualDate"
            class="d-flex flex-column px-4 py-2"
            width="300px"
          >
            <span class="text-notification text-notification--unread">{{ `${item.trainee}` }}</span>
            <span>Выполняет {{ item.actualStatus.toLocaleLowerCase() }}: </span>
            <span>"{{ item.taskName }}"</span>
          </v-card>
          <v-card
            v-else
            class="d-flex flex-column px-4 py-2"
            width="300px"
          >
            <span>{{ item.actualStatus }}</span>
          </v-card>
        </v-menu>
      </template>
    </v-data-table-virtual>
  </c-table-container>
</template>

<script setup lang="ts">
import { inject, ref } from 'vue';
import type { ComputedRef } from 'vue';
import { sortByProperty } from '@/lib/utils';
import type { GroupDataModel } from '@/components/pages/TutorPanelPage/models/ViewGroups/GroupDataModel';
import { GroupMemberModel } from '@/components/pages/TutorPanelPage/models/ViewGroups/GroupMemberModel';
import { IColorFilter } from '@/components/common/interfaces/IColorFilter';
import CColorFilters from '@/components/common/ui/CColorFilters.vue';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

/**
 * @property {GroupDataModel | null} groupData Информация о группе
 * @property {boolean} isDataReceived Статус получения данных с сервера
 */
const props = withDefaults(defineProps<{
  groupData: GroupDataModel | null;
  isDataReceived: boolean
}>(), {
  groupData: null,
});

const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

/** Переменная, хранящая участников группы */
const groupMembers = ref<GroupMemberModel[]>(sortByProperty(props.groupData?.trainees || [], 'trainee'));

/** Метод, фильтрующий участников группы по дате */
const filterGroupMembersByActualDate = (items: GroupMemberModel[]) => (groupMembers.value = items);

/** Тип рейтинга стажера в зависимости от очков */
const ratingClass = (rating: number) => rating >= 5 ? 'text--positive' : 'text--negative';

const headers = [
  { title: 'ФИО стажёра', value: 'trainee' },
  { title: 'Актуальность данных', value: 'actualDate' },
  { title: 'Рабочий статус', value: 'actualStatus' },
  { title: 'Стаж, дней', value: 'experienceInDays' },
  { title: 'Рейтинг', value: 'totalRatingPoints' },
] as object[];

const traineeStatuses: IColorFilter<GroupMemberModel>[] = [
  { color: 'white', value: 'Все', tooltip: 'Все данные' },
  { color: 'green', value: 'Актуальные данные', tooltip: 'Актуальные данные' },
  { color: 'red', value: 'Неактуальные данные', tooltip: 'Неактуальные данные' },
];
</script>

<style lang="scss" scoped>
@import '@/styles/colorVars.scss';

.nowrap {
  white-space: nowrap;
}

.clickable {
  color: $lk-blue;
  text-decoration: underline;
  cursor: pointer;
}

.text {
  &--underlined {
    text-decoration: underline;
  }

  &--positive {
    color: $lk-green;
  }

  &--negative {
    color: $lk-red;
  }
}
</style>
