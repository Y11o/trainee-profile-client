<template>
  <v-app>
    <c-nav-bar />
    <c-drawer-layout/>
    <c-base-modal />
    <c-snackbar />
    <v-main>
      <router-view />
    </v-main>
    <c-footer />
  </v-app>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue';
import { useWindowSize } from '@vueuse/core';
import CDrawerLayout from '@/components/common/ui/widgets/ui/CDrawerLayout.vue';
import CBaseModal from '@/components/common/ui/widgets/ui/modals/CBaseModal.vue';
import CSnackbar from '@/components/common/ui/widgets/ui/CSnackbar.vue';
import CFooter from '@/components/common/ui/CFooter/CFooter.vue';
import CNavBar from '@/components/common/ui/CNavBar/CNavBar.vue';
import '@/styles/index.scss';

const { width } = useWindowSize();

const isDesktop = computed(() => width.value >= 1280);

provide('isDesktop', isDesktop);
</script>
