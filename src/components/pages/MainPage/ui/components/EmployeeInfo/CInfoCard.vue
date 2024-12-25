<template>
  <div class="w-100 info-card">
    <div class="d-flex">
      <v-avatar
        class="d-flex d-lg-none mr-4"
        rounded="lg"
        size="64"
      >
        <v-img
          alt="Фото"
          :src="profileImageUrl"
          @error="handleImageError"
        />
      </v-avatar>
      <div class="w-100">
        <p class="font-weight-bold text-h5">{{ employeeData?.fullName }}</p>
        <p class="info-card__position text-subtitle-1 mt-auto">{{ employeeData?.role }}</p>
      </div>
      <v-icon
        class="info-card__expansion mt-auto d-lg-none"
        :icon="isBasicInfoShown ? 'mdi-chevron-up' : 'mdi-chevron-down'"
        @click="isBasicInfoShown = !isBasicInfoShown"
      />
    </div>
    <div 
      class="d-lg-flex"
      style="position: relative;"
    >
      <div class="info-card__photo">
        <v-icon 
          v-show="isBasicInfoShown"
          icon="mdi-camera"
          class="upload-icon" 
          size="32"
          color="grey"
          @click="photoPreviewShown = true"
        />
        <photo-input-modal 
          :photoPreviewShown="photoPreviewShown"
          @upload-photo="hendleUploadPhoto"
          @close-modal="photoPreviewShown = false"
        />
        <img
          class="d-none d-lg-flex"
          alt="Фото"
          width="400px"
          :src="profileImageUrl"
          @error="handleImageError"
        />
      </div>
      <div class="info-card__description w-100 mx-lg-5 my-4 my-lg-0">
        <c-basic-info
          v-show="isBasicInfoShown"
          :data="employeeData?.traineeInfo.details"
          :curator-data="employeeData?.traineeInfo.curator"
          :mentor-data="employeeData?.traineeInfo.mentor"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref, watch } from 'vue';
import type { EmployeeModel } from '@/components/pages/MainPage/models/employee/EmployeeModel';
import CBasicInfo from '@/components/pages/MainPage/ui/components/EmployeeInfo/CBasicInfo.vue';
import PhotoInputModal from '@/components/pages/MainPage/ui/components/EmployeeInfo/modal/PhotoInputModal.vue';
import DefaultImageUrl from '@/assets/img/main-page/avatar_default.jpg';

/**
 * @param {EmployeeModel} employeeData Массив с данными о стажере: фото, детали стажера, данные его куратора и наставника
 * @param {string} profileImage src фотографии профиля
 */
const props = defineProps<{
  employeeData?: EmployeeModel;
  profileImage: string
}>();

const emit = defineEmits(['reload-profile']);

/**
 * Переменная для хранения src фотографии профиля
 */
const profileImageUrl = ref(props.profileImage);

/**
 * Переменная, отвечающая за статус загрузки фото
 */
const isImageError = ref<boolean>(false);

/**
 * Переменная, отвечающая за показ модального окна для смены фото профиля
 */
 const photoPreviewShown = ref<boolean>(false);

/**
 * Переменная, отвечающая за показ/скрытие подробной информации о стажере
 */
const isBasicInfoShown = ref<boolean>(false);

/**
 * Переменная, содержащая текущую ширину окна
 */
const screenWidth = ref<number>(window.innerWidth);

/**
 * Вызов handleResize и создание листенера на текущую ширину окна до появления компонента в DOM дереве
 */
onBeforeMount(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
});

/**
 * Удаление листенера на текущую ширину окна при уничтожении компонента
 */
onUnmounted(() => window.removeEventListener('resize', handleResize));

/**
 * Метод, обновляющий значение screenWidth и присваивающий isBasicInfoShown значение true при значечении screenWidth >= 1280
 */
const handleResize = () => {
  screenWidth.value = window.innerWidth;
  isBasicInfoShown.value = screenWidth.value >= 1280;
};

/**
 * Подстановка заглушки аватара в случае отсутствия у пользователя фото профиля
 */
const handleImageError = () => {
  isImageError.value = true;
  profileImageUrl.value = DefaultImageUrl;
};

/**
 * Перезагрузка фото профиля при успешном изменении фотографии
 */
const hendleUploadPhoto = async () => emit('reload-profile');

/**
 * Отслеживание изменений src фотографии профиля
 */
watch(() => props.profileImage, (newImage) => {
  profileImageUrl.value = newImage;
});
</script>

<style scoped lang="scss">
@import "@/styles/index";

.upload-icon {
  position: absolute; 
  top: 8px; 
  left: 8px; 
  cursor: pointer; 
  z-index: 1000; 
}

.info-card {
  &__position {
    color: $lk-blue;
  }

  &__expansion {
    color: $lk-gr;
  }

  &__photo img {
    max-width: 250px;
  }

  @media (min-width: 1280px) {
    &__description {
      max-width: 400px;
    }
  }
}
</style>
