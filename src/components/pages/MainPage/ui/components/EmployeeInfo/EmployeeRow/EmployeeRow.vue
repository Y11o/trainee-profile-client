<template>
  <div class="d-flex justify-space-between align-center table-row">
    <p class="table-cell table-cell__name">
      {{ title }}
    </p>
    <v-btn
      v-if="title === 'Рейтинг' || title === 'Куратор' || title === 'Наставник'"
      class="table-cell text-capitalize pa-0 text-decoration-underline"
      variant="text"
      size="x-small"
      @click="emit('ShowModal')"
    >
      {{ content }}
    </v-btn>
    <p
      v-else
      class="table-cell"
    >
      {{ content }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * @param {string} title Заголовок строки с подробной информацией о стажере
 * @param {string} content Содержимое строки с подробной информацией о стажере
 */
defineProps<{
  title: string;
  content: string;
}>();

const emit = defineEmits(['ShowModal']);
</script>

<style lang="scss">
@import "@/styles/index";

.table-row {
  margin-top: 19px;
  border-bottom: 1px solid $lk-gb-40;
  padding: 3px 0;

  .table-cell {
    font-weight: 400;
    font-size: 15px;
    color: $lk-dark;

    &__name {
      font-weight: 500;
    }
  }
}
</style>
