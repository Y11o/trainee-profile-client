<template>
  <v-container
    class="h-100 page-color"
    fluid
  >
    <v-container
      class="page-block-container"
      fluid
    >
      <contacts-desktop-layout
        v-if="smAndUp"
        :contacts-data="contactsData"
      />
      <contacts-mobile-layout
        v-else
        :contacts-data="contactsData"
      />
    </v-container>
  </v-container>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useDisplay } from 'vuetify';
import ContactsData from '@/components/pages/ContactsPage/models/contacts.json';
import ContactsMobileLayout from '@/components/pages/ContactsPage/ui/components/ContactsMobileLayout.vue';
import ContactsDesktopLayout from '@/components/pages/ContactsPage/ui/components/ContactsDesktopLayout.vue';
import { ContactModel } from '@/components/pages/ContactsPage/models/ContactModel';

const { smAndUp } = useDisplay();

/**
 * Данные о представленных в контактах людях
 */
const contactsData = ref<ContactModel[]>([]);

onBeforeMount(() => getContactsData());

/**
 * Метод получения контактов из JSON'а
 */
const getContactsData = () => contactsData.value = ContactsData.contacts.map((contact) => new ContactModel(contact));
</script>
