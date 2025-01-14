<template>
  <div class="table-data">
    <div class="d-none d-lg-flex align-center table-data__header">
      <v-icon icon="mdi-account-circle-outline" />
      <p class="title">Основная информация</p>
    </div>
    <v-divider class="line d-none d-lg-flex" />
    <employee-row
      v-for="item in fixedGroupName"
      :key="item.rowName"
      :title="item.rowName"
      :content="item.content"
      @show-modal="ratingShown = true"
    />
    <employee-row
      v-if="curatorData?.name"
      title="Куратор"
      :content="`${curatorData?.surname} ${curatorData?.name}`"
      @show-modal="showCuratorInfo"
    />
    <employee-row
      v-if="mentorData?.name"
      class="table-data__mentor"
      title="Наставник"
      :content="`${mentorData?.surname} ${mentorData?.name}`"
      @show-modal="showMentorInfo"
    />
    <v-dialog
      v-model="curatorMentorModalShown"
      max-width="500"
    >
      <curator-mentor-modal
        :title="dialogTitle"
        :body="dialogContent"
        @close-modal="curatorMentorModalShown = false"
      />
    </v-dialog>
    <v-dialog
      v-model="ratingShown"
      max-width="500"
    >
      <rating-modal @close-modal="ratingShown = false"/>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { EmployeeDetailsModel } from '@/components/pages/MainPage/models/employee/EmployeeDetailsModel';
import { CuratorModel } from '@/components/pages/MainPage/models/employee/curator/CuratorModel';
import type { MentorModel } from '@/components/pages/MainPage/models/employee/mentor/MentorModel';
import EmployeeRow from '@/components/pages/MainPage/ui/components/EmployeeInfo/EmployeeRow/EmployeeRow.vue';
import CuratorMentorModal from '@/components/pages/MainPage/ui/components/EmployeeInfo/modal/CuratorMentorModal.vue';
import RatingModal from '@/components/pages/MainPage/ui/components/EmployeeInfo/modal/rating/RatingModal.vue';

/**
 * @param {EmployeeDetailsModel[]} [data = []] Массив, содержащий подробные данные о стажере, отображаемых в таблице с информацией
 * @param {CuratorModel} curatorData Данные о кураторе, отображаемые в таблице с информацией и в модальном окне при нажатии на строку
 * @param {MentorModel} mentorData Данные о наставнике, отображаемые в таблице с информацией и в модальном окне при нажатии на строку
 */
const props = withDefaults(
  defineProps<{
    data: EmployeeDetailsModel[];
    curatorData?: CuratorModel;
    mentorData?: MentorModel;
  }>(), {
    data: () => []
  }
);

/**
 * Переменная, отвечающая за показ модального окна с информацией о рейтинге
 */
const ratingShown = ref<boolean>(false);

/**
 * Переменная, отвечающая за показ модального окна с информацией о кураторе или наставнике
 */
const curatorMentorModalShown = ref<boolean>(false);

/**
 * Заголовок выводимого модального окна
 */
const dialogTitle = ref<string>('');

/**
 * Поля модального окна и их значения по умолчанию
 */
const defaultDialogContent = new CuratorModel({
  name: '',
  surname: '',
  patronymic: '',
  email: '',
  tg: ''
});

/**
 * Переменная, содержащая контент выводимого окна
 */
const dialogContent = ref<CuratorModel>(defaultDialogContent);

const fixedGroupName = computed(() => 
  props.data.map((row, index: number) => {
    if (index === props.data.length - 1) {
      return {
        ...row,
        content: row.content.match(/^\d+/)?.[0] || row.content
      };
    }
    return row;
  })
);

/**
 * Вотчер, присваивающий дефолтные значения заголовку и полям модального окна с инфо о кураторе/наставнике при его закрытии
 */
watch(
  () => curatorMentorModalShown.value,
  () => {
    if (!curatorMentorModalShown.value) {
      dialogContent.value = defaultDialogContent;
      dialogTitle.value = '';
    }
  }
);

/**
 * Метод, присваюващий содержимому модального окна значения данных о кураторе
 */
const showCuratorInfo = () => {
  dialogTitle.value = 'Информация о кураторе';
  dialogContent.value = {
    name: props.curatorData?.name,
    surname: props.curatorData?.surname,
    patronymic: props.curatorData?.patronymic,
    email: props.curatorData?.email,
    tg: props.curatorData?.tg
  };
  curatorMentorModalShown.value = true;
};

/**
 * Метод, присваюващий содержимому модального окна значения данных о наставнике
 */
const showMentorInfo = () => {
  dialogTitle.value = 'Информация о наставнике';
  dialogContent.value = {
    name: props.mentorData?.name,
    surname: props.mentorData?.surname,
    patronymic: props.mentorData?.patronymic,
    email: props.mentorData?.email,
    tg: props.mentorData?.tg
  };
  curatorMentorModalShown.value = true;
};
</script>

<style scoped lang="scss">
@import "@/styles/index";

.table-data {
  &__header {
    padding-bottom: 13px;
    border-bottom: 1px solid $lk-gb-40;

    .title {
      font-weight: 500;
      font-size: 14px;
      color: $lk-dark;
      text-transform: uppercase;
      margin-left: 12px;
    }
  }

  .line {
    background-color: $lk-blue;
    max-width: 226px;
    height: 3px;
    border-radius: 4px 4px 0 0;
  }

  @media (width < 1280px) {
    align-items: center;
    border-radius: 8px;
    border: 1px solid $lk-gb-40;
    background: $lk-white;
    padding: 16px;

    &__mentor {
      border-bottom: 0;
    }
  }
}
</style>
