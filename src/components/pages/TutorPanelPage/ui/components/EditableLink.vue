<template>
  <p>
    {{ text }}
    <a
      v-if="!isEditOn"
      :href="link"
      target="_blank"
    >
      {{ link }}
    </a>
    <v-text-field
      v-else
      v-model="newLink"
      autofocus
      variant="plain"
      color="grey"
      density="compact"
      @blur="editLink"
    />
    <v-btn
      v-if="!isEditOn"
      icon="mdi-pencil-box-outline"
      variant="text"
      density="compact"
      @click="isEditOn = true"
    />
  </p>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

/**
 * @property {string} link Ссылка
 * @property {string} text Текст, отображаемый перед ссылкой
 */
const props = withDefaults(
  defineProps<{
    link: string;
    text: string;
  }>(),
  {
    link: '',
    text: '',
  },
);

const emit = defineEmits(['onEditLink']);

/** Переменная, отвечающая за включение/выключение режима редактирования */
const isEditOn = ref<boolean>(false);

/** Переменная, хранящая новую ссылку */
const newLink = ref<string>(props.link);

watch(() => props.link, () => newLink.value = props.link);

/** Метод, отвечающий за редактирование ссылки */
const editLink = () => {
  isEditOn.value = false;
  emit('onEditLink', newLink.value);
};
</script>

<style scoped lang="scss">
@import '@/styles/colorVars.scss';

a {
  color: $lk-blue;
}
</style>
