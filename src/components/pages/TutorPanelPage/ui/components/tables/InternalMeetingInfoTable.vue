<template>
  <c-table-container>
    <template #header>
      Подробности встречи
    </template>
    <div
      v-if="!isLoading && internalMeetingInfo.eventId"
      class="content h-100 w-100 d-flex flex-column px-4"
    >
      <div class="content__data overflow-auto mt-2 pr-1">
        <p class="font-weight-medium text-body-2 text-uppercase">
          {{ internalMeetingInfo.title }}
        </p>
        <internal-meeting-row
          title="ФИО:"
          :content="`${formatName(currentEmployee, false)} ${groupInfo}`"
        />
        <internal-meeting-row
          title="Дата, время встречи:"
          :content="internalMeetingInfo.timeStarted.slice(0, -3)"
        />
        <internal-meeting-row
          title="Место встречи:"
          :content="`Кабинет ${internalMeetingInfo.event.cabinet}`"
        />
        <internal-meeting-row
          v-if="facilitator"
          title="Фасилитатор:"
          :content="facilitator"
        />
        <internal-meeting-row
          v-if="host"
          title="Ведущий:"
          :content="host"
        />
        <internal-meeting-row
          title="Роль:"
          :content="currentEmployee.role.name"
        />
        <internal-meeting-row
          v-if="otherMembers.length"
          title="Другие участники встречи:"
          :content="otherMembers"
        />
        <internal-meeting-row
          v-if="internalMeetingInfo.title.includes('Фасилитация')"
          title="Тест-мотив"
        />
      </div>
      <div class="comment d-flex flex-column justify-center mt-auto mb-4 text-body-2">
        <div class="comment__title d-flex align-center px-2">
          <p class="font-weight-medium">Комментарий после внутренней встречи</p>
        </div>
        <div class="comment__text pa-2 overflow-auto">{{ internalMeetingInfo.comment }}</div>
      </div>
    </div>
    <v-skeleton-loader
      v-else-if="isLoading"
      color="transparent"
      type="article"
    />
  </c-table-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import InternalMeetingRow from '@/components/pages/TutorPanelPage/ui/components/InternalMeetingRow.vue';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

/**
 * @property {IInternalMeetingInfoData} internalMeetingInfo Информация о внутренней встрече
 * @property {boolean} isLoading Статус получения данных с сервера
 */
const props = defineProps<{
  internalMeetingInfo: IInternalMeetingInfoData,
  isLoading: boolean,
}>();

/** Стажер, участвующий во внутренней встрече */
const currentEmployee = computed(() =>
  findMemberBy((item) => item.employeeId === props.internalMeetingInfo.employee.id)
);

/** Группа и направление участника внутренней встречи */
const groupInfo = computed(() =>
  `(Группа ${props.internalMeetingInfo.groupNumber}, ${props.internalMeetingInfo.departmentName})`
);

/** Другие участники встречи */
const otherMembers = computed(() =>
  props.internalMeetingInfo.members?.filter((item) => item.employeeId !== props.internalMeetingInfo.employee.id)
    .filter((item) => item.role.name != 'Фасилитатор')
    .filter((item) => item.role.name != 'Ведущий')
    .map((item) => formatName(item, true))
);

/** ФИО Фасилитатора */
const facilitator = computed(() =>
  formatName(findMemberBy((item) => item.role.name === 'Фасилитатор'), true)
);

/** ФИО Ведущего */
const host = computed(() =>
  formatName(findMemberBy((item) => item.role.name === 'Ведущий'), true)
);

/** Поиск участника встречи по заданному условию */
const findMemberBy = (condition: any): any => props.internalMeetingInfo.members?.find(condition) || null;

/** Приведение имени к определенному формату по выбору: 'Фамилия И.О.' или 'Фамилия Имя Отчество' */
const formatName = (member: IInternalMeetingMember, withInitials: boolean): string => {
  if (member) {
    return withInitials
      ? `${member.surname} ${member.name[0]}.${member.patronymic[0]}.`
      : `${member.surname} ${member.name} ${member.patronymic}`;
  } else {
    return '';
  }
};
</script>

<style scoped lang="scss">
@import '@/styles/colorVars.scss';

.content {
  height: 320px;
}

.comment {
  border: 1px solid $lk-gb-40;

  &__title {
    background-color: $lk-gr-background;
    border-bottom: 1px solid $lk-gb-40;
    height: 36px;
  }

  &__text {
    height: 80px;
  }
}

.content__data {
  height: 196px;
}
</style>
