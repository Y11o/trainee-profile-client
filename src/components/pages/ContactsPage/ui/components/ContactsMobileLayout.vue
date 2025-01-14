<template>
  <div class="d-flex flex-column ga-4">
    <contact-profile-card
      v-for="item in contactsData"
      :key="item.id"
      :contact="item"
    />
  </div>
</template>

<script setup lang="ts">
import ContactProfileCard from '@/components/pages/ContactsPage/ui/components/ContactProfileCard.vue';
import type { ContactModel } from '@/components/pages/ContactsPage/models/ContactModel';

defineProps<{
  contactsData: ContactModel[];
}>();
</script>
