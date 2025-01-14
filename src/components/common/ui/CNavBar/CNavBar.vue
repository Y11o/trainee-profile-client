<template>
  <v-app-bar
    class="navbar px-lg-16"
    density="compact"
    flat
  >
    <v-spacer :class="!isAuthPage ? 'd-none d-xl-flex' : ''"/>
    <v-app-bar-nav-icon
      v-if="!isAuthPage"
      class="navbar__icon d-flex d-lg-none"
      @click="isDrawerOpened = !isDrawerOpened"
    />
    <img
      src="@/assets/img/logo/logo_default.svg"
      alt="CRTRIS logo"
    >
    <v-spacer class="d-flex d-lg-none"/>
    <v-toolbar-items
      v-if="!isAuthPage"
      class="d-flex align-center ga-7 ml-7"
    >
      <router-link
        v-for="item in routesGroup"
        :key="item.title"
        class="d-none d-lg-flex font-weight-medium"
        :to="item.route"
      >
        {{ item.title }}
      </router-link>
      <nav-bar-widgets v-if="!isDrawerOpened"/>
    </v-toolbar-items>
    <v-spacer class="d-none d-lg-flex"/>
    <v-toolbar-items
      v-if="!isAuthPage"
      class="d-none d-lg-flex align-center ga-7 font-weight-medium"
    >
      <!-- TODO: убрать userDataStore.role.isCurator после появления роли ассистента -->
      <router-link
        v-if="userDataStore.roleIs.isCurator"
        to="/tutor-panel"
      >
        ПУ КУРАТОРА
      </router-link>
      <router-link
        class="d-flex align-center ga-1"
        to="/auth"
      >
        <v-icon icon="mdi-flip-h mdi-login-variant"/>
        ВЫХОД
      </router-link>
    </v-toolbar-items>
    <v-spacer :class="!isAuthPage ? 'd-none d-xl-flex' : 'd-none'"/>
  </v-app-bar>
  <nav-drawer
    v-if="!isAuthPage"
    v-model="isDrawerOpened"
    :routes-group="routesGroup"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import NavDrawer from '@/components/common/ui/CNavBar/NavDrawer.vue';
import NavBarWidgets from '@/components/common/ui/CNavBar/NavBarWidgets.vue';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';

/**
 * Данные адресов для главной страницы, страницы расписания, страницы FAQ, страницы контактов
 */
const routesGroup = [
  { title: 'ГЛАВНАЯ', route: '/' },
  { title: 'РАСПИСАНИЕ', route: '/sched' },
  { title: 'FAQ', route: '/faq' },
  { title: 'КОНТАКТЫ', route: '/contacts' },
];

/**
 * Переменная, отвечающая за показ навигационной панели слева
*/
const isDrawerOpened = ref<boolean>(false);

/**
 * Поле, отвечающее за маршрутизатор
 */
const route = useRoute();

const userDataStore = useUserDataStore();

/**
 * Вычисляемое свойство, показывающее, открыта ли страница авторизации
 */
const isAuthPage = computed(() => route.name === 'authPage');

/**
 * Отслеживание размеров экрана, при меньшей ширине, чем установленная, показывает возможность
 * открытия навигационной пагели слева
 */
window.matchMedia('(min-width: 1280px)').addEventListener('change', () => isDrawerOpened.value = false);
</script>

<style scoped lang="scss">
@import '@/styles/colorVars';

.navbar__icon, a {
  color: $lk-gr;
  text-decoration: none;
}

.router-link-active {
  color:  $lk-blue;
}
</style>
