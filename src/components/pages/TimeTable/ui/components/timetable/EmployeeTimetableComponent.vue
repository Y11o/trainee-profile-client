<template>
  <v-card variant="flat">
    <c-modal-header @close-icon-clicked="emit('closeTab')">
      <template #header>
        <h3>Расписание стажёров</h3>
      </template>
    </c-modal-header>
    <c-student-name-select
      class="ma-2 pa-0"
      :isMySchedule="true"
      :isMultiple="false"
      @clear-schedule="clearSchedule"
      @update-selected-users="getSelectedUserId"
    />
    <v-card
      class="mx-2 my-4"
      variant="outlined"
    >
      <div class="text-subtitle-2 font-weight-medium text-left pa-2">
        ЕЖЕНЕДЕЛЬНОЕ РАСПИСАНИЕ
      </div>
      <v-divider/>
      <v-data-table-virtual
        :headers="employeeTimetableHeaders"
        :items="filteredRegularSchedules"
        :mobile="false"
      >
        <template #item="{ item }: { item: IRegularScheduleInterface }">
          <tr>
            <td>
              <span>{{ item.rusDayOfWeek }}</span>
            </td>
            <td>
              <span>{{ !item.weekIsEven ? 'Еженедельно' : weekParityStatus(item.weekIsEven) }}</span>
            </td>
            <td>
              <span>{{ item.startTime  + '-' + item.finishTime }}</span>
            </td>
            <td>
              <span>{{ `${item.desk.number}(каб.${item.desk.cabinet.name})` }}</span>
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
    </v-card>
    <v-card
      class="ma-2 pa-0"
      variant="outlined"
    >
      <div class="text-subtitle-2 font-weight-medium text-left pa-2">
        БРОНИРОВАНИЯ
      </div>
      <v-divider/>
      <v-data-table-virtual
        :headers="activeReservationsHeaders"
        :items="scheduleByUser.intervals"
        :mobile="false"
      >
        <template #item="{ item }: { item: IScheduleDisplayInterface }">
          <tr>
            <td>
              <span>{{ item.date.toLocaleDateString('ru') }}</span>
            </td>
            <td>
              <span>{{ formatDisplayedTimeRange(item.startTime, item.finishTime) }}</span>
            </td>
            <td>
              <span class="truncate-text">
                {{ `${item.desk.name} (каб.${item.cabinet})` }}
              </span>
            </td>
            <td>
              <span>
                {{ bookingStatus(item.bookingStatus) }}
              </span>
            </td>
            <td v-if="comparedUserId">
              <span>
                <v-icon
                  icon="mdi-trash-can-outline"
                  class="mr-1"
                  color="grey-darken-2"
                  @click="scheduleRequestsStore.deleteUserInterval(item.id)"
                />
              </span>
            </td>
          </tr>
        </template>
      </v-data-table-virtual>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatDisplayedTimeRange } from '@/lib/utils';
import type { IRegularScheduleInterface, IScheduleDisplayInterface } from '@/components/pages/TimeTable/interfaces/IScheduleInterface';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';
import { useScheduleRequestsStore } from '@/components/pages/TimeTable/stores/scheduleRequestsStore';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';
import CStudentNameSelect from '@/components/pages/TimeTable/ui/components/timetable/CHeaderPickerComponents/CStudentNameSelect.vue';

/**
 * @param {regularSchedules: IRegularScheduleInterface[], intervals: IScheduleDisplayInterface[]} scheduleByUser
 * Расписание сотрудника
 */
const props = defineProps<{
  scheduleByUser: {
    regularSchedules: IRegularScheduleInterface[],
    intervals: IScheduleDisplayInterface[]
  }
}>();

const emit = defineEmits(['closeTab']);

/**
 * Экземпляр класса {@link useScheduleRequestsStore}
 */
const scheduleRequestsStore = useScheduleRequestsStore();

/**
 * Переменная, хранящая данные о расписании сотрудника
 */
const scheduleByUser = ref<{regularSchedules: IRegularScheduleInterface[], intervals: IScheduleDisplayInterface[]}>(props.scheduleByUser);

/**
 * Фильтрация данных регулярного расписания сотрудника во избежание повторных выводов дня недели
 */
const filteredRegularSchedules = computed(() => {
  const seen: any = {};

  return scheduleByUser.value.regularSchedules?.reduce((result: IRegularScheduleInterface[], item) => {

    const key = JSON.stringify({ ...item, id: undefined, weekIsEven: undefined });

    if (!seen[key]) {
      seen[key] = true;
      result.push({ ...item, weekIsEven: null, id: item.id, rusDayOfWeek: item.rusDayOfWeek });
    }
    return result;
  }, []);
});

/**
 * Метод очистки данных из таблиц
 */
const clearSchedule = (selectedUserNames: null | number[] | number) => {
  selectedUserNames === null ?
    scheduleByUser.value = {
      regularSchedules: [],
      intervals: []
    }
  : scheduleByUser.value = props.scheduleByUser;
};

const selectedUserId = ref<number>();

const getSelectedUserId = (userId: number) => selectedUserId.value = userId;

const comparedUserId = computed(() => selectedUserId.value === useScheduleStore().currentUserId);


const employeeTimetableHeaders = ref<TableHeader[]>([
  {
    title: 'День недели',
    align: 'start'
  },
  {
    title: 'Чётность недели',
    align: 'start'
  },
  {
    title: 'Время',
    align: 'start'
  },
  {
    title: 'Стол',
    align: 'start'
  },
]);

/**
 * Настройки заголовков таблицы броней сотрудника
 */
const activeReservationsHeaders = ref<TableHeader[]>([
  {
    title: 'Дата',
    align: 'start'
  },
  {
    title: 'Время',
    align: 'start'
  },
  {
    title: 'Стол',
    align: 'start'
  },
  {
    title: 'Тип',
    align: 'start'
  },
  {
    title: '',
    align: 'start'
  },
]);

/**
 * Форматирование вывода информации о четности/нечетности недели
 */
const weekParityStatus = (isWeekEven: boolean) => isWeekEven? 'Четная' : 'Нечетная';

/**
 * Форматирование вывода информации о типе брони
 */
const bookingStatus = (bookingStatus: string) => {
  switch (bookingStatus) {
    case 'ARREARS':
      return 'Отработка пропуска';
    case 'OVERTIME':
      return 'Дополнительно';
    default:
      return 'не указано';
  }
};
</script>

<style scoped lang="scss">
.v-table__wrapper > table > tbody > tr:not(:first-child) > td {
  border-bottom: none !important;
  padding: 5px;
}

span {
  font-size: 12px !important;
}

@media (width >= 1280px) {
  .v-table {
    padding-left: 5px;
    padding-right: 5px;
  }
}

th {
  padding: 0px 0px !important;
  margin: 0;
}

.v-table--density-default {
  --v-table-header-height: 50px !important;
  --v-table-row-height: 30px !important;
}
</style>
