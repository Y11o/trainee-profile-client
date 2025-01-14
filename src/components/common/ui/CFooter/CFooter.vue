<template>
  <v-footer
    class="footer-block d-flex flex-column py-3 justify-center px-4 w-100"
    :class="smAndUp ? 'px-16' : 'px-6'"
  >
    <div class="d-flex justify-end align-end h-100 w-100">
      <div class="footer-block__inner d-flex justify-end align-content-center flex-wrap ga-3">
        <div class="d-flex flex-wrap justify-center align-center ga-8">
          <Logo
            v-for="item in links"
            :key="item.id"
            :img="item.img"
            :title="item.title"
            :link="item.link"
          />
        </div>
      </div>
    </div>
  </v-footer>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
import { links } from '@/components/common/stores/logoLinksData';
import Logo from '@/components/common/ui/Logotype.vue';

const { smAndUp } = useDisplay();
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

.footer-block {
  background: $lk-gr-background;

  &__inner {
    width: 100%;
    min-height: 60px;
  }

  &__title {
    color: $lk-gr;
  }
}
</style>
