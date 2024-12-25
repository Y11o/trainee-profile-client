<template>
  <v-container
    class="main-page"
    fluid
  >
    <v-container class="w-xl-75 main-page__container">
      <div class="d-flex justify-space-between align-start mb-4 flex-column flex-lg-row">
        <c-info-card
          :employee-data="employeeStore.employeeData?.employee"
          :profileImage="profileImage"
          @reload-profile="updateProfileData"
        />
        <c-date-picker
          v-if="screenWidth >= 1280"
          v-model="calendarStore.date"
          hide-weekends
          :events="eventsByCalendarDate"
          :is-enable-expansion="isCalendarExpanded"
          :calendar-max-width="maxCalendarWidth"
        />
        <c-date-info
          v-else
          class="w-100"
          :chosen-date="calendarStore.date"
          :events="eventsByCalendarDate"
          :is-bordered-block="true"
        />
      </div>
      <progress-tracker class="progress-tracker" />
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, ref } from 'vue';
import router from '@/router';
import { useScheduleStore } from '@/components/pages/TimeTable/stores/scheduleStore';
import { useCalendarStore } from '@/components/pages/MainPage/store/calendarStore';
import { useEmployeeStore } from '@/components/pages/MainPage/store/employeeStore';
import CDateInfo from '@/components/common/ui/CDateInfo.vue';
import CDatePicker from '@/components/common/ui/CDatePicker/CDatePicker.vue';
import ProgressTracker from '@/components/pages/MainPage/ui/components/ProgressTracker/ProgressTracker.vue';
import CInfoCard from '@/components/pages/MainPage/ui/components/EmployeeInfo/CInfoCard.vue';

const scheduleStore = useScheduleStore();
const employeeStore = useEmployeeStore();
const calendarStore = useCalendarStore();

/** Переменная для хранения src фотографии профиля */
const profileImage = ref<string>('');

/** Переменная для хранения статуса календаря: расширен/сжат */
const isCalendarExpanded = ref<boolean>(true);

/** Переменная для хранения брейкопинта ширины окна, необходимой для расширения календаря */
const maxCalendarWidth = ref<number>(1820);

/** Текущая ширина окна */
const screenWidth = ref<number>(window.innerWidth);

/** События на выбранную дату в календаре */
const eventsByCalendarDate = computed(() => employeeStore.calendarEventsByDate(calendarStore.date));

/**
 * Перенаправление на страницу авторизации в случае отсутствия токена в userDataStore или ошибки при установлении ID
 * пользователя. Вызов метода handleResize, добавление листенера на текущую ширину окна, вызов метода getUserData
 */
onBeforeMount(async () => {
  calendarStore.resetDate();
  handleResize();

  window.addEventListener('resize', handleResize);

  await getEmployeeData();
  await loadProfileImage();
});

/** Удаление листенера на текущую ширину окна при уничтожении компонента */
onUnmounted(() => window.removeEventListener('resize', handleResize));

/**
 * Метод, вычисляющий значение screenWidth и присваивающий isCalendarExpanded значение true,
 * если screenWidth больше maxCalendarWidth
 */
const handleResize = () => {
  screenWidth.value = window.innerWidth;
  isCalendarExpanded.value = screenWidth.value > maxCalendarWidth.value;
};

/**
 * Метод, отправляющий GET-запрос в employeeStore на получение информации о стажере.
 * В случае успеха в employeeStore.employeeData записываются полученные из запроса данные.
 * В случае ошибки происходит очищение localStorage и перенаправление на страницу авторизации.
 */
const getEmployeeData = async () => {
  try {
    await employeeStore.getEmployeeData();

    if (employeeStore.employeeData) {
      scheduleStore.setScheduleByUser(employeeStore.employeeData.calendarEvents);
      localStorage.setItem('user', employeeStore.employeeData.employee.fullName);
    }
  } catch (e) {
    localStorage.clear();
    router.push('/auth');
  }
};

/**
 * Метод, отправляющий GET-запрос на получение фото профиля.
 * В случае некорректного формата отображает ошибку.
 */
const loadProfileImage = async () => {
  try {
    const imageBlob = await employeeStore.employeeApi.loadProfileImage();

    if (profileImage.value) {
      URL.revokeObjectURL(profileImage.value);
    }
    
    profileImage.value = URL.createObjectURL(imageBlob);
  } catch (error) {
    console.error('Ошибка загрузки фото:', error);
  }
};

/** Перезагрузка фотографии профиля */
const updateProfileData = async () => await loadProfileImage();
</script>

<style scoped lang="scss">
@import "@/styles/index";

.main-page {
  height: 100%;
  background-color: $lk-gr-background;

  &__container {
    max-width: 80%;

    @media (max-width: 726px) {
      max-width: 100%;
    }

    @media (min-width: 960px) and (max-width: 1054px) {
      max-width: 100%;
    }

    @media (min-width: 1054px) and (max-width: 1200px) {
      max-width: 90%;
    }
  }
}
</style>
