import { createRouter, createWebHistory } from 'vue-router';
import { RoleEnum } from '@/components/common/constants/RoleEnum';
import { routes } from '@/router/routes';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';

const router = createRouter({
  // @ts-expect-error
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const userDataStore = useUserDataStore();

  /**
   * Проверка - авторизован ли пользователь
   * Если нет - перенаправление на страницу авторизации с сохранением изначальной ссылки
   */
  if (
    to.name !== 'authPage'
    && (to.meta.requiresAuth === undefined || to.meta.requiresAuth)
    && !userDataStore.isAuthorized
  ) {
    //next({ name: 'authPage', query: { redirect: to.fullPath } });
    if (from.path === '/sched') {
      next({ name: 'authPage', query: { redirect: '/sched' } });
    } else {
      next({ name: 'authPage', query: { redirect: to.fullPath } });
    }
  } else if (
    /**
     * Проверка - имеются ли права у пользователя для перехода по данному роуту
     * (включает ли массив {@link permissions} этого роута роль, которая у пользователя)
     * Если нет - перенаправление на главную страницу
     */
    userDataStore.isAuthorized
    && userDataStore.userRole
    && to.meta.permissions
    && !to.meta.permissions.includes(userDataStore.userRole)
  ) {
    next({ name: 'mainPage' });
  } else {
    /**
     * Если пользователь авторизован и имеются права на переход по роуту - происходит перенаправление на этот роут
     */
    next();
  }
});

declare module 'vue-router' {
  interface RouteMeta {
    /**
     * Массив ролей, доступных для перехода по данному роуту
     */
    permissions?: RoleEnum[];

    /**
     * Обязательна ли авторизация для данного роута
     */
    requiresAuth?: boolean;
  }
}

export default router;
