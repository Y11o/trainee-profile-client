<template>
  <v-container
    class="h-100 page-color"
    fluid
  >
    <v-container
      class="page-block-container"
      fluid
    >
      <questions-table :questions="questionsData"/>
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import QuestionsTable from '@/components/pages/FAQPage/ui/QuestionTable/QuestionsTable.vue';
import Questions from '@/components/pages/FAQPage/questions.json';

/**
 * Список вопросов
 */
const questionsData = ref<IQuestion[]>([]);

onBeforeMount(async () => await getQuestionsData());

/**
 * Получение списка вопросов из JSON'а
 */
const getQuestionsData = async () => {
  questionsData.value = Questions;
};
</script>

<style scoped lang="scss">
@import "@/styles/colorVars";
</style>
