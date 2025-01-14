<template>
  <v-card>
    <c-modal-header @close-icon-clicked="emit('closeModal')">
      <template #header>
        <h3>Рейтинг стажёра</h3>
      </template>
    </c-modal-header>
    <p class="ma-2">Ваш текущий рейтинг: 24</p>
    <history-row
      v-for="data in debugRating"
      :key="data.id"
      :rating="data"
    />
    <v-card-actions>
      <p>Общий рейтинг
        <a
          color="light-blue"
          target="_blank"
          :href="commonRatingLink"
        >
          тут
        </a>
      </p>
      <v-spacer/>
      <v-btn
        class="controls"
        density="compact"
        text="Ок"
        @click="emit('closeModal')"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import CModalHeader from '@/components/common/ui/widgets/ui/modals/CModalHeader.vue';
import HistoryRow from '@/components/pages/MainPage/ui/components/EmployeeInfo/modal/rating/HistoryRow.vue';

const emit = defineEmits(['closeModal']);

/**
 * Рейтинг стажера
 */
const rating = ref<number | string>('Не указано');

/**
 * Ссылка на общий рейтинг стажеров
 */
const commonRatingLink = '';

onBeforeMount(async () => {
  console.log('Getting rating info'); //todo: сделать запрос на сервер на получение истории изменения рейтинга стажера
});

const debugRating = ref<RatingData[]>([
  {
    id: 1,
    grade: 2,
    isPlus: true,
    type: 'Практика',
    name: 'ЛК'
  },
  {
    id: 2,
    grade: 1,
    isPlus: false,
    type: 'Просрочка',
    name: 'ЛК'
  }
]);
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.controls {
  background: $lk-gr-background;
  border: 1px solid $lk-gr-border;
}
</style>