<template>
  <c-modal-window
    :modelValue="photoPreviewShown"
    title="Загрузка фото профиля"
    dialogWidth="400px"
    confirmBtnText="загрузить"
    :hasControls="true"
    :stayOnConfirmBtnClick="false"
    :disabled="imageUrl ? false : true"
    @confirmAction="uploadPhoto"
    @onCloseModal="closeModal"
  >
    <template #content>
      <v-container class="d-flex flex-column justify-content-center pa-0 w-100">
        <v-file-input
          v-model="loadedFile"
          class="w-100"
          variant="outlined"
          prepend-icon=""
          prepend-inner-icon="mdi-folder-open"
          density="compact"
          label="Выбрать фото"
          style="width: 100%;"
          hide-detaile="false"
          @change="validateFileFormat"
        />
        <div v-if="imageUrl && loadedFile">
          <img
            :src="imageUrl"
            alt="Фото профиля"
            class="img-rules"
          />
        </div>
        <div
          v-else-if="!imageUrl && loadedFile"
          v-html="fileError"
          style="color: red"
        ></div>
      </v-container>
    </template>
  </c-modal-window>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { EmployeeApi } from '@/components/pages/MainPage/network/EmployeeApi';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import CModalWindow from '@/components/common/ui/widgets/ui/modals/CModalWindow.vue';

defineProps<{
  photoPreviewShown: boolean
}>();

const emit = defineEmits(['closeModal', 'uploadPhoto']);

const loadedFile = ref<File>();
const imageUrl = ref<string | null>(null);
const fileError = ref<string>('');

const employeeApi = new EmployeeApi('/employees');

const allowedFormats = ['image/jpeg', 'image/png'];

const validateFileFormat = () => {
  if (loadedFile.value) {
    const fileType = loadedFile.value.type;

    if (!allowedFormats.includes(fileType)) {
      fileError.value = 'Загружен неверный формат фото.<br />Разрешены: JPEG, PNG.';
      imageUrl.value = null;
    } else {
      imageUrl.value = URL.createObjectURL(loadedFile.value);
    }
  }
};

const uploadPhoto = async () => {
  const formData = new FormData();

  if (loadedFile.value) {
    formData.append('file', loadedFile.value);
  }

  formData.append('employeeId', `${useUserDataStore().userID}`);

  await employeeApi.uploadPhoto(formData)
    .then(() => {
      URL.revokeObjectURL(imageUrl.value!);
      imageUrl.value = null;
      emit('closeModal');
      emit('uploadPhoto');
    })
    .catch((err) => console.error(err));
};

const closeModal = () => emit('closeModal');
</script>

<style scoped lang="scss">
.img-rules {
  max-width: 380px;
  max-height: 600px;
  min-width: 350px;
}
</style>
