<template>
  <v-card
    class="d-flex flex-column align-center"
    variant="text"
  >
    <v-sheet :height="64"/>
    <v-avatar
      class="profile__avatar"
      size="128"
    >
      <img
        v-if="contact.id === 1"
        class="profile__photo"
        src="@/assets/img/contacts-page/first_men.jpg"
        :alt="contact.img.alt"
      >
      <img
        v-else
        class="profile__photo"
        src="@/assets/img/contacts-page/second_men.jpg"
        :alt="contact.img.alt"
      >
    </v-avatar>
    <v-card-text class="profile__details w-100 text-center pt-16">
      <div class="text-h6">{{ formatName() }}</div>
      <div class="text-subtitle-1 mb-3">{{ contact.role }}</div>
      <div><a>{{ contact.email }}</a></div>
      <div><a :href="`tel:${contact.phoneLink}`">{{ contact.phone }}</a></div>
      <v-btn
        :href="contact.telegram.ref"
        class="profile__button w-100 mt-6 text-body-2"
        variant="flat"
      >
        {{ contact.telegram.nik }}
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import type { ContactModel } from '@/components/pages/ContactsPage/models/ContactModel';

const props = defineProps<{
  contact: ContactModel;
}>();

const formatName = (): string => `${props.contact.user.surname} ${props.contact.user.name} ${props.contact.user.patronymic}`;
</script>

<style scoped lang="scss">
@import "@/styles/colorVars";

.profile {
  &__avatar {
    position: absolute;
    top: 0;
    border: 1px solid $lk-gb-40;
  }

  &__details {
    background-color: $lk-white;
    border: 1px solid $lk-gb-40;
    border-radius: 8px;
  }

  &__button{
    background-color: $lk-blue-light;
    color: $lk-blue;
  }

  &__photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

}

a {
  color: $lk-blue;
  text-decoration: underline;
}
</style>
