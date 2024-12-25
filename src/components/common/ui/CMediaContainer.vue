<template>
  <!-- px-5 py-5  -->
  <v-container
    v-if="isDesktop"
    class="timetable-block w-100"
    fluid
    rounded
  >
    <div class="text-subtitle-2 font-weight-medium text-left">
      <slot name="title"/>
    </div>
    <slot name="content"/>
  </v-container>
  <v-expansion-panels
    v-else
    variant="accordion">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <slot name="title"/>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <slot name="content"/>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup lang="ts">
import { inject } from 'vue';

/**
 * Переменная, обозначающая, десктопное ли устройство
 */
const isDesktop = inject<boolean>('isDesktop');
</script>

<style lang="scss">
@import "@/styles/index.scss";

.timetable-block {
  @extend .bordered-block;
  height: fit-content;
  padding: 0;
}
</style>
