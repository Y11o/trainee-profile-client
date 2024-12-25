<template>
  <date-select
    :model-value="modelValue"
    :popover="false"
    @update:model-value="(value) => emit('update:modelValue', value)"
  >
    <template #default="{ inputValue, togglePopover, inputEvents }">
      <div
        class="date-picker rounded d-inline-flex px-2 py-1 align-item-center border-sm"
        @click="togglePopover"
      >
        <v-icon
          icon="mdi-calendar-range-outline"
          class="mr-1"
          color="grey-darken-2"
        />
        <input
          class="date-picker__input"
          :value="inputValue"
          v-on="inputEvents"
        />
      </div>
    </template>
  </date-select>
</template>

<script setup lang="ts">
import { DatePicker as DateSelect } from 'v-calendar';

/**
 * @param {Date} modelValue выбранная дата
 */
withDefaults(
  defineProps<{
    modelValue: Date;
  }>(), {
    modelValue: () => new Date(),
  },
);

const emit = defineEmits(['update:modelValue']);
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";

.date-picker {
  height: 32px;
  background-color: $lk-gr-background;
  border: 1px solid $lk-gb-40;

  &__input {
    width: 70px;
    color: $lk-blue;
    font-weight: 500;
    line-height: 32px;
    font-size: 14px;
  }
}
</style>
