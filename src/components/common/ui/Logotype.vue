<template>
  <img
    :class="['cursor-pointer', additionalClass]"
    :src="img"
    :alt="`Ссылка на ${title}`"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
/**
 * @param {String} img ресурс с изображением
 * @param {String} title название ресура
 * @param {String} link ссылка, куда будет происходить редирект при нажатии на иконку
 * @param {String} additionalClass дополнительный класс
 */
const props = defineProps<{
  img: string,
  title: string,
  link: string,
  additionalClass?: string
}>();

/**
 * Нажатие на логотип. Редирект на соответствующий ресурс, открывая новую вкладку
 */
const handleClick = () => window.open(props.link, '_blank');
</script>
