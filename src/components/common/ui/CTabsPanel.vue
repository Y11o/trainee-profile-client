<template>
  <v-container
    class="page-color h-100 px-6 px-lg-4"
    fluid
  >
    <template v-if="isDesktop">
      <v-container
        class="page-block-container"
        fluid
      >
        <c-media-container class="panel-container">
          <template #title>
            <div class="text-subtitle-2 font-weight-medium text-left">
              <slot name="title" />
            </div>
            <v-toolbar-items class="d-flex align-center ga-7 px-4 py-4 border-b">
              <router-link
                v-for="item in items"
                :key="item.title"
                class="d-none d-md-flex font-weight-medium"
                :to="item.path"
              >
                {{ item.title }}
              </router-link>
            </v-toolbar-items>
          </template>
          <template #content>
            <v-sheet
              class="pa-6 pb-7 bg-transparent"
              height="440"
            >
              <router-view />
            </v-sheet>
          </template>
        </c-media-container>
      </v-container>
    </template>
    <template v-else>
      <v-expansion-panels
        v-model="activeItem"
        variant="accordion"
        rounded="lg"
        elevation="0"
      >
        <v-expansion-panel
          v-for="item in items"
          :key="item.path"
          class="border-color font-weight-medium"
          :value="item.path"
          :title="item.title"
        >
          <v-expansion-panel-text eager>
            <component :is="item.component" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { inject, onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import CMediaContainer from '@/components/common/ui/CMediaContainer.vue';
import type { ITabsPanel } from '@/components/common/interfaces/ITabsPanel';

const props = withDefaults(
  defineProps<{
    routeName: string;
    items?: ITabsPanel[];
  }>(), {
    items: () => [],
  },
);

const route = useRoute();
const router = useRouter();

const isDesktop = inject<ComputedRef<boolean>>('isDesktop');

const activeItem = ref<string>('');

watch(activeItem, () => {
  if (activeItem.value) {
    router.push(activeItem.value);
  } else {
    router.push({ name: props.routeName });
  }
});

onBeforeMount(() => {
  if (!isDesktop?.value) {
    activeItem.value = route.fullPath;
  }
});
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";

a {
  color: $lk-gr;
  text-decoration: none;
}

.border-color {
  border: 1px solid $lk-gb-40;
}

.router-link-active {
  color: $lk-blue;
}

.panel-container {
  padding: 0 !important;
}

.v-expansion-panels {
  display: flex;
  gap: 16px;

  ::after {
    visibility: hidden;
  }
}

:deep(.v-expansion-panel-text__wrapper) {
  padding: 0;
}

:deep(.v-expansion-panel-title__overlay) {
  visibility: hidden;
}

:deep(.v-expansion-panels--variant-accordion > :first-child:not(:last-child)),
:deep(.v-expansion-panels--variant-accordion > :last-child:not(:first-child)),
:deep(.v-expansion-panels--variant-accordion > :not(:first-child):not(:last-child)) {
  border-radius: 8px !important;
}
</style>
