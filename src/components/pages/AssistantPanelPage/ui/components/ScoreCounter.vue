<template>
  <v-text-field
    v-model="counter"
    width="50px"
    placeholder="—"
    variant="plain"
    type="number"
    hide-details
    :class="{
      'text-decoration-underline': !readonly && counter,
      'input-cursor-pointer': readonly,
    }"
    :readonly="readonly"
    :hideSpinButtons="false"
    @blur="onChangeScore"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * @property {number} score баллы за сертификат
 * @property {boolean} [readonly] блокирование изменения счетчика
 */
const props = withDefaults(defineProps<{
  score: number,
  readonly?: boolean;
}>(), {
  readonly: false,
});

const emit = defineEmits(['changeScore']);

const counter = ref<number>(props.score);

const onChangeScore = () => emit('changeScore', +counter.value);
</script>

<style scoped lang="scss">
:deep(.v-field__input) {
  padding: 0;
  height: 20px;
}

.input-cursor-pointer {
  :deep(.v-field__input) {
    cursor: pointer;
  }
}

:deep(.v-field__input) {
  min-height: 30px;
  font-size: 14px;
}
</style>
