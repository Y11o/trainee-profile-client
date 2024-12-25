<template>
  <div
    class="status-box d-flex rounded-lg"
    :class="color"
  >
    <div class="status-box__text font-weight-medium text-caption text-wrap">{{ text }}</div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string;
    text?: string;
  }>(),
  {
    color: 'blue',
    text: 'Выбрать',
  },
);
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

.status-box {
  width: 180px;
  min-height: 24px;

  &__text {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 6px;
  }
}

.green {
  background-color: rgba($lk-green, 0.2);
}

.red {
  background-color: rgba($lk-red, 0.2);
}

.yellow {
  background-color: rgba($lk-yellow, 0.2);
}

.blue {
  background-color: rgba($lk-blue, 0.2);
}
</style>
