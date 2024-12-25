<template>
  <div :class="{ 'border-t pa-6': !isDesktop }">
    <v-card
      class="bg-transparent"
      max-width="300"
      rounded="lg"
      flat
    >
      <v-card-subtitle class="pa-0 mb-5 text-body-1">
        Загрузка данных системы СКУД
      </v-card-subtitle>
      <v-form
        v-model="isValid"
        validate-on="lazy input"
        @submit.prevent="uploadFile"
      >
        <div>
          <div class="mb-1">
            <span class="text-body-1 font-weight-bold">Номер недели:</span>
          </div>
          <v-select
            v-model="weekNumber"
            :clearable="false"
            :items="weeks"
          />
        </div>
        <v-card-item class="pt-4 pb-0 px-0">
          <v-file-input
            v-model="loadedFile"
            class="w-100"
            variant="outlined"
            prepend-icon=""
            prepend-inner-icon="mdi-folder-open"
            density="compact"
            label="Выбрать файл"
            :accept="accept"
            :clearable="false"
            :rules="[(v) => (v && v.length > 0)]"
            :loading="isLoading"
          />
        </v-card-item>
        <v-card-actions class="pt-0">
          <div class="d-flex w-100">
            <v-spacer/>
            <v-btn
              class="controls"
              type="submit"
              density="comfortable"
              :disabled="!isValid || isLoading"
            >
              Загрузить
            </v-btn>
          </div>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { getISOWeek } from 'date-fns';
import { useLoading } from '@/lib/utils/useLoading';
import { AssistantPanelApi } from '@/components/pages/AssistantPanelPage/network/AssistantPanelApi';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';

const snackbarStore = useSnackbarStore();

const { isLoading, withLoading } = useLoading(false);

const isDesktop = inject<boolean>('isDesktop');

const assistantPanelApi = new AssistantPanelApi('');

const loadedFile = ref<File>();

const isValid = ref<boolean>(false);

const weekNumber = ref<number>(getISOWeek(new Date()));

const weeks = computed(() => Array.from({ length: weekNumber.value }, (_, i) => i + 1));

const uploadFile = async () => {
  const formData = new FormData();

  if (loadedFile.value && weekNumber.value) {
    formData.append('file', loadedFile.value);
    formData.append('weekNum', `${weekNumber.value}`);
  }

  await withLoading(
    assistantPanelApi.uploadWeekScudData(formData)
      .then(() => {
        loadedFile.value = undefined;
        snackbarStore.openSnackbar(`Данные за ${weekNumber.value} неделю успешно загружены.`);
      })
      .catch(() => snackbarStore.openSnackbar('Ошибка загрузки данных. Повторите попытку.', { icon: 'error' }))
  );
};

const accept = [
  'application/vnd.ms-excel',
  'application/vnd.ms-excel',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
  'application/vnd.ms-excel.sheet.macroEnabled.12',
  'application/vnd.ms-excel.template.macroEnabled.12',
  'application/vnd.ms-excel.addin.macroEnabled.12',
  'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
];
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

:deep(.v-card-item__content) {
  overflow: visible;
}

.controls {
  background: $lk-gr-background;
  border: 1px solid $lk-gr-border;
}

:deep(.v-field__prepend-inner) {
  > .v-icon {
    color: #7d7d7d !important;
    opacity: 1;
  }
}

:deep(.v-field--error) {
  .v-label.v-field-label,
  > .v-field__outline {
    color: #aaaaaa !important;
  }
}

</style>
