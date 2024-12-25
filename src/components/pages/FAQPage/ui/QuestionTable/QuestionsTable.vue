<template>
  <c-table-container
    header-variant="plain"
    rounded="lg"
    :header-density="smAndUp ? 'default' : false"
    :subtable="false"
  >
    <template #header>
      <div
        class="question-table w-100 d-flex justify-space-between flex-column flex-sm-row align-center px-4 py-2 py-sm-0">
        <span class="question-table__title pb-2 pb-sm-0">
          ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ
        </span>
        <v-text-field
          v-model.trim="searchQuery"
          class="w-100"
          variant="outlined"
          placeholder="Поиск"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details
          :max-width="mdAndUp ? 352 : 222"
        />
      </div>
    </template>
    <v-expansion-panels
      v-model="expandedPanels"
      variant="accordion"
      focusable
      multiple
      static
      flat
    >
      <v-expansion-panel
        v-for="([key, item], i) in shownQuestions"
        :key="key"
        :value="key"
        class="expansion-question-panel"
        :class="{ 'mb-1': i !== shownQuestions.size - 1 }"
      >
        <template #title>
          <span
            class="font-weight-medium v-expansion-panel-title__overlay-inner"
            v-html="item.question"
          />
        </template>
        <template #text>
          <span
            class="text-body-2 expansion-question-panel__text"
            v-html="item.answer"
          />
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
    <div
      v-if="isEmptyResults"
      class="empty-block text-center py-4"
    >
      <span class="text-body-2">Не найдено</span>
    </div>
  </c-table-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useDisplay } from 'vuetify';
import { formatLinksInText } from '@/lib/utils';
import CTableContainer from '@/components/common/ui/CTableContainer.vue';

/**
 * @param {IQuestion[]} [questions = []] список вопросов и ответов к ним
 */
const props = withDefaults(defineProps<{
  questions: IQuestion[],
}>(), {
  questions: () => [],
});

const { mdAndUp, smAndUp } = useDisplay();

/**
 * Поисковый запрос
 */
const searchQuery = ref<string>('');

const expandedPanels = ref<string[]>([]);

/**
 * Отформатированные вопросы
 */
const formattedQuestions = computed(() =>
  props.questions.map((item) => ({ ...item, answer: formatLinksInText(item.answer) })));

/**
 * Отображаемые вопросы
 */
const shownQuestions = computed(() => {
  const filteredQuestions = new Map<IQuestion['question'], IQuestion>();

  if (searchQuery.value) {
    formattedQuestions.value.forEach((item) => {
      const highlightQuestion = highlightSearchQuery(item.question, searchQuery.value);
      const highlightAnswer = highlightSearchQuery(item.answer, searchQuery.value);

      if (highlightQuestion || highlightAnswer) {
        filteredQuestions.set(item.question, {
          question: highlightQuestion || item.question,
          answer: highlightAnswer || item.answer,
        });
      }
    });
  } else {
    formattedQuestions.value.forEach((item) =>
      filteredQuestions.set(item.question, { question: item.question, answer: item.answer }),
    );
  }

  return filteredQuestions;
});

/**
 * Поле, отвечающее, пустой ли результат поиска
 */
const isEmptyResults = computed(() => searchQuery.value && !shownQuestions.value.size);

watch(shownQuestions, () => {
  expandedPanels.value = searchQuery.value ? Array.from(shownQuestions.value.keys()) : [];
});

/**
 * Метод подсветки найденного вопроса
 * @param {string} str Строка
 * @param {string} searchQuery Введеный запрос
 */
const highlightSearchQuery = (str: string, searchQuery: string) => {
  if (str && searchQuery) {
    /* eslint-disable-next-line no-useless-escape */
    const regex = new RegExp(`(${searchQuery.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');

    const highlight = (str: string) => str.replace(regex, match => `<span class="highlight">${match}</span>`);

    const format = (parts: string[], options: { ingoreTags: boolean }) => parts
        .map((part) => {
          if (part.startsWith('<')) {
            return options.ingoreTags ? '' : part;
          }
          return highlight(part);
        }).join('');

    const splittedByTag = str.split(/(<[^>]+>)/g);

    if (!regex.test(format(splittedByTag, { ingoreTags: true }))) {
      return;
    }

    return format(splittedByTag, { ingoreTags: false });
  } else {
    return;
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/colorVars";

:deep(.highlight) {
  background-color: rgba($lk-blue, 0.4);
}

:deep(.text-link) {
  color: $lk-blue;
}

.question-table {
  &__title {
    color: $lk-gr;
  }
}

.v-expansion-panels {
  background-color: $lk-white;
}

.expansion-question-panel {
  &__text {
    white-space: pre-wrap;
  }

  :deep(.v-expansion-panel-title) {
    &:hover, &:active {
      background-color: $lk-gr-background;
    }
  }

  :deep(.v-expansion-panel-text) {
    background-color: $lk-gr-background;
  }

  :deep(.v-expansion-panel-title__overlay) {
    opacity: 0;
  }

  .v-expansion-panel-title__overlay-inner {
    z-index: 1;
    white-space: pre-wrap;
  }

  :deep(.v-expansion-panel-title--active) .v-expansion-panel-title__overlay {
    background-color: $lk-gr-background;
    opacity: 1;
  }
}

:deep(.v-field__input) {
  padding: 8px;
  height: 30px;
  min-height: 30px;
  font-size: 14px;
}

.empty-block {
  background-color: $lk-white;
  color: $lk-gr;
}
</style>
