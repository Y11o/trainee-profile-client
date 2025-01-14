<template>
  <c-table-container
    header-variant="plain"
    header-density="default"
    rounded="lg"
    :subtable="false"
  >
    <template #header>
      <div class="communication-table w-100 d-flex justify-space-between align-center px-4">
        <span class="communication-table__title">КОНТАКТЫ</span>
      </div>
    </template>
    <v-container
      v-for="(item, index) in contactsData"
      :key="item.id"
      class="px-8 py-8 d-flex flex-row ga-8"
      fluid
      style="background-color: #fff;"
    >
      <img
        v-if="index === 0"
        src="@/assets/img/contacts-page/first_men.jpg"
        :alt="item.img.alt"
        width="128px"
      />
      <img
        v-if="index === 1"
        src="@/assets/img/contacts-page/second_men.jpg"
        :alt="item.img.alt"
        width="128px"
      />
      <div class="d-flex flex-column text-body-2">
        <span class="font-weight-medium">
          {{ item.user.surname }} {{ item.user.name }} {{ item.user.patronymic }}
        </span>
        <span>{{ item.role }}</span>
        <br/>
        <span><a>{{ item.email }}</a></span>
        <span>{{ item.phone }}</span>
        <span><a :href="item.telegram.ref">{{ item.telegram.nik }}</a></span>
        <br v-if="index !== contactsData.length - 1"/>
      </div>
    </v-container>
  </c-table-container>
</template>

<script setup lang="ts">
import CTableContainer from '@/components/common/ui/CTableContainer.vue';
import type { ContactModel } from '@/components/pages/ContactsPage/models/ContactModel';

defineProps<{
  contactsData: ContactModel[];
}>();
</script>

<style scoped lang="scss">
@import "@/styles/colorVars";

.communication-table {
  &__title {
    color: $lk-gr;
  }

  &__icon {
    color: $lk-gr;
  }
}

a {
  color: $lk-blue;
  text-decoration: underline;
}

.v-expansion-panels {
  background-color: $lk-white;
}

.expansion-question-panel {
  :deep(.v-expansion-panel-title) {
    &:hover, &:active {
      background-color: $lk-gr-background;
    }
  }

  :deep(.v-expansion-panel-text) {
    background-color: $lk-gr-background;
  }

  :deep(.v-expansion-panel-title__overlay) {
    opacity: 0;
  }

  .v-expansion-panel-title__overlay-inner {
    z-index: 1;
  }

  :deep(.v-expansion-panel-title--active) .v-expansion-panel-title__overlay {
    background-color: $lk-gr-background;
    opacity: 1;
  }
}
</style>
