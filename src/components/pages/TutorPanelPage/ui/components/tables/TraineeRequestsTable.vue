<template>
  <c-table-container>
    <template #header>
      <v-badge
        class="d-flex align-center"
        color="#0987FC"
        inline
        :content="unreadRequestsCount"
      >
        Запросы стажеров
      </v-badge>
      <v-spacer/>
      <c-color-filters
        filter-param="requestStatus"
        allShownFilterText="Все"
        :filters="requestStatuses"
        :items-to-filter="requestsData"
        @on-apply-filters="filterRequestsByStatus"
      />
    </template>
    <v-data-table-virtual
      density="compact"
      hide-default-header
      hover
      loading-text="Данные загружаются"
      :loading="!isDataReceived"
      :headers="headers"
      :items="displayTraineeRequests"
      :mobile="false"
      @click:row="markAsRead"
    >
      <template #item="{ item }">
        <v-menu
          density="compact"
          transition="scale-transition"
          location="center"
          close-on-content-click
        >
          <template #activator="{ props }">
            <tr
              v-bind="props"
              :class="item.isRequestApproved || item.isRequestRejected ? 'text-notification--read' : ''"
              @click="markAsRead(item)"
            >
              <td>
                <span :class="['indicator', requestIndicatorClass(item)]">•</span>
              </td>
              <td>
                <span style="text-decoration: underline;">{{ item.type }}</span>
              </td>
              <td>
                <span>{{ item.trainee.shortName }}</span>
              </td>
              <td>
                <span>{{ item.date.toLocaleDateString('ru') }}</span>
              </td>
              <td>
                <span>{{ item.groupNumber }}</span>
              </td>
            </tr>
          </template>
          <c-request-details-modal
            :requestDetails="item"
            @approve="markAsApproved(item)"
            @reject="markAsRejected(item)"
          />
        </v-menu>
      </template>
    </v-data-table-virtual>
  </c-table-container>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { TraineeRequestsModel } from '@/components/pages/TutorPanelPage/models/TraineeRequests/TraineeRequestsModel';
import TablesData from '@/components/pages/TutorPanelPage/models/response.json';
import { IColorFilter } from '@/components/common/interfaces/IColorFilter';
import CRequestDetailsModal from '@/components/pages/TutorPanelPage/ui/components/modals/CRequestDetailsModal.vue';
import CColorFilters from '@/components/common/ui/CColorFilters.vue';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

/** Переменная, хранящая статус получения данных с сервера */
const isDataReceived = ref<boolean>(false);

/** Переменная, хранящая запросы стажеров */
const requestsData = ref<TraineeRequestsModel[]>([]);

/** Переменная, хранящая отображаемые запросы стажеров */
const displayTraineeRequests = ref<TraineeRequestsModel[]>([]);

/** Количество непрочитанных запросов */
const unreadRequestsCount = computed(() => requestsData.value.filter(item => !item.isRequestApproved).length);

onBeforeMount(async () => {
  await getRequestsData();
  displayTraineeRequests.value = requestsData.value;
});

/** Метод получения информации о запросах стажеров. */
const getRequestsData = async () => {
  const data = JSON.parse(JSON.stringify(TablesData.requests)) as IRequest[];
  requestsData.value = data.map(e => new TraineeRequestsModel(e));
  isDataReceived.value = true;
};

/** Метод фильтрации запросов по статусу */
const filterRequestsByStatus = (items: TraineeRequestsModel[]) => displayTraineeRequests.value = items || requestsData;

/** Метод, отвечающий за смену статуса запроса на прочитанный */
const markAsRead = (item: TraineeRequestsModel) => item.isRequestRead = true;

/** Метод, отвечающий за смену статуса запроса на утвержденный */
const markAsApproved = (item: TraineeRequestsModel) => item.isRequestApproved = true;

/** Метод, отвечающий за смену статуса запроса на отвергнутый */
const markAsRejected = (item: TraineeRequestsModel) => item.isRequestRejected = true;

/** Метод, отвечающий за смену цвета индикатора запроса в зависимости от его статуса */
const requestIndicatorClass = (item: TraineeRequestsModel): string => {
  switch (true) {
    case item.isRequestApproved:
      return 'point--green';
    case item.isRequestRejected:
      return 'point--red';
    case !item.isRequestRead:
      return 'point--blue';
    default:
      return 'point--hidden';
  }
};

const headers = [
  { title: '', value: 'readNotification', width: '2px', align: 'end' },
  { title: 'Тип запроса', value: 'type', width: '400px', maxWindth: '600px', align: 'start' },
  { title: 'ФИО стажёра', value: 'traineeName', width: '200px', maxWidth: '300px', align: 'start' },
  { title: 'Дата запроса', value: 'date', width: '150px', align: 'start' },
  { title: 'Группа', value: 'group', align: 'start' },
] as object[];

const requestStatuses: IColorFilter<TraineeRequestsModel>[] = [
  { color: 'white', value: 'Все', tooltip: 'Все запросы' },
  { color: 'black', value: 'Активные запросы', tooltip: 'Активные запросы' },
  { color: 'green', value: 'Утвержденные запросы', tooltip: 'Утвержденные запросы' },
  { color: 'red', value: 'Отвергнутые запросы', tooltip: 'Отвергнутые запросы' },
  { color: 'blue', value: 'Новые запросы', tooltip: 'Новые запросы' },
];
</script>

<style lang="scss" scoped>
@import '@/styles/colorVars.scss';

.point {
  &--red {
    color: $lk-red;
  }

  &--green {
    color: $lk-green;
  }

  &--blue {
    color: $lk-blue;
  }

  &--hidden {
    display: none;
  }
}

.bordered {
  border: 1px solid $lk-gb-40;
  border-radius: 0 0 4px 4px;
}

.controls {
  background: $lk-gr-background;
  border: 1px solid $lk-gr;
  cursor: pointer;
}
</style>
