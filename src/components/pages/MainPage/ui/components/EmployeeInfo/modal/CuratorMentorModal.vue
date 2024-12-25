<template>
  <v-card max-width="500">
    <c-modal-header @close-icon-clicked="emit('CloseModal')">
      <template #header>
        <h3>{{ title }}</h3>
      </template>
    </c-modal-header>
    <div class="ma-4">
      <p class="mb-2">
        Ваш {{ title === 'Информация о наставнике'? 'наставник' : 'куратор' }}: {{ body.surname }} {{ body.name }}
      </p>
      <p
        v-if="body.email"
        class="mb-2"
      >
        E-mail: <a :href="`mailto:${body.email}`">{{ body.email }}</a>
      </p>
      <p v-if="body.tg">
        Telegram: <a :href="body.tg">{{ body.tg }}</a>
      </p>
    </div>
    <v-card-actions>
      <v-spacer />
      <v-btn
        text="Ок"
        class="controls"
        density="compact"
        variant="outlined"
        @click="emit('CloseModal')"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import type { CuratorModel } from '@/components/pages/MainPage/models/employee/curator/CuratorModel';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';

/**
 * @param {string} title Заголовок модального окна с инфо о кураторе или наставнике
 * @param {CuratorModel} body Содержимое модального окна с инфо о кураторе или наставнике
 */
defineProps<{
  title: string;
  body: CuratorModel
}>();

const emit = defineEmits(['CloseModal']);
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.controls {
  background: $lk-gr-background;
  border: 1px solid $lk-gr-border;
}
</style>
