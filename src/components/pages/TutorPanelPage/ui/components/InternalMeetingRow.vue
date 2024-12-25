<template>
  <div class="d-flex justify-space-between row py-1">
    <p
      class="text-subtitle-2"
      :class="title === 'Тест-мотив' ? 'link cursor-pointer text-decoration-underline' : 'cell'"
    >
      {{ title }}
    </p>
    <div
      v-if="title === 'Другие участники встречи:'"
      class="cell text-body-2"
    >
      <div
        v-for="item in content"
        :key="item"
      >
        {{ item }}
      </div>
    </div>
    <div
      v-else
      class="cell text-body-2"
    >
      {{ content }}
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * @property {string} title Название строки
 * @property {string | string[]} [content] Содержимое строки
 */
withDefaults(defineProps<{
  title: string;
  content?: string | string[];
}>(), {
  title: '',
  content: '',
});
</script>

<style scoped lang="scss">
@import "@/styles/index";

.row {
  border-bottom: 1px solid $lk-gb-40;

  .cell {
    color: $lk-dark;
  }

  .link {
    color: $lk-blue;
  }
}
</style>
