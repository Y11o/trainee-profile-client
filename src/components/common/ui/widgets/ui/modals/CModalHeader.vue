<template>
  <div class="header d-flex pa-2 text-body-2 justify-space-between">
    <slot name="header" />
    <v-icon
      icon="mdi-close"
      class="header__icon"
      @click="emit('closeIconClicked')"
    />
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['closeIconClicked']);
</script>

<style scoped lang="scss">
@import "@/styles/colorVars.scss";

.header {
  background: linear-gradient(180deg, rgba(242, 242, 242, 0) 0%, $lk-gb-40 100%);
  color: $lk-dark;

  &__icon {
    color: $lk-gr;
  }
}
</style>