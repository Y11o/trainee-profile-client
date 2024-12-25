<template>
  <v-container
    class="table-container h-100 d-flex flex-column pa-0"
    fluid
  >
    <div
      class="table-container__header w-100 d-flex align-center px-2 text-body-2 font-weight-medium"
      :class="headerClasses"
    >
      <slot name="header"/>
    </div>
    <div
      class="table-container__content"
      :class="contentClasses"
    >
      <slot/>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    headerVariant?: 'plain' | 'filled';
    headerDensity?: 'default' | 'compact' | false;
    rounded?: 'md' | 'lg';
    subtable?: boolean;
  }>(),
  {
    headerVariant: 'filled',
    headerDensity: 'compact',
    rounded: 'md',
    subtable: true,
  },
);

const headerClasses = computed(() => `
  header-variant-${props.headerVariant}
  ${props.headerDensity ? `header-density-${props.headerDensity}` : ''}
  header-rounded-${props.rounded}
  ${props.subtable ? 'header-mobile' : ''}
`);

const contentClasses = computed(() => `
  content-rounded-${props.rounded}
  ${props.subtable ? 'content-mobile' : ''}
`);
</script>

<style scoped lang="scss">
@import '@/styles/colorVars.scss';

:deep(.v-table) .v-table__wrapper > table > tbody > tr > td {
  border-bottom: none;
}

:deep(.v-data-table__tr) :last-child {
  .v-btn:hover > .v-btn__overlay {
    visibility: hidden;
  }

  .v-ripple__container {
    visibility: hidden;
  }
}

.table-container {
  &__header, &__content {
    border-style: solid;
    border-color: $lk-gb-40;
  }

  &__header {
    flex-shrink: 0;
    border-width: 1px;
  }

  &__content {
    border-width: 0px 1px 1px 1px;
    flex: 1 1 auto;
    overflow: auto;
  }
}

.header {
  &-variant {
    &-plain {
      background-color: $lk-white;
    }

    &-filled {
      background-color: $lk-gr-background;
    }
  }

  &-density {
    &-compact {
      height: 36px;
    }

    &-default {
      height: 48px;
    }
  }

  &-rounded {
    &-md {
      border-radius: 4px 4px 0 0;
    }

    &-lg {
      border-radius: 8px 8px 0 0;
    }
  }

  &-mobile.header-rounded-md,
  &-mobile.header-rounded-lg {
    @media (max-width: 1280px) {
      border-radius: 0;
    }
  }

  &-mobile {
    @media (max-width: 1280px) {
      border-width: 1px 0;
    }
  }
}

.content {
  &-rounded {
    &-md {
      border-radius: 0 0 4px 4px;
    }
    &-lg {
      border-radius: 0 0 8px 8px;
    }
  }

  &-mobile.content-rounded-md,
  &-mobile.content-rounded-lg {
    @media (max-width: 1280px) {
      border-radius: 0 0 24px 24px;
    }
  }

  &-mobile {
    @media (max-width: 1280px) {
      border-width: 0;
    }
  }
}
</style>
