<template>
  <div class="d-flex">
    <v-icon
      icon="mdi-circle-medium"
      :color="rating.isPlus? 'green' : 'red'"
    />
    <p class="mr-1">{{ rating.isPlus? '+' : '−' }}2</p>
    <p class="mx-3">{{ rating.type }}: '{{ rating.name }}'</p>
  </div>
</template>

<script setup lang="ts">
/**
 * @param {RatingData} rating Изменение в рейтинге
 */
defineProps<{
  rating: RatingData
}>();
</script>
