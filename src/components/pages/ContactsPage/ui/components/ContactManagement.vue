<template>
  <v-btn
    class="contact-management-btn"
    target="_blank"
    variant="outlined"
    height="30"
    :href="feedbackUrl"
  >
    НАПИСАТЬ РУКОВОДСТВУ ЦЕНТРА
  </v-btn>
</template>

<script setup lang="ts">
/**
 * Ссылка на анонимную форму вопросов и предложений
 */
const feedbackUrl = 'http://crtris-base.nicetu.spb.ru/form/492VavdGGRT80Gd_eGe-cWZHmr-26wJhEBlEU57r1Ic';
</script>

<style scoped lang="scss">
@import "src/styles/colorVars.scss";

.contact-management-btn {
  background-color: $lk-white;
  border: 1px solid $lk-gr-border;

  &:deep(span.v-btn__content) {
    font-size: 13px;
  }
}

a {
  color: $lk-blue;
  text-decoration: underline;
}
</style>
