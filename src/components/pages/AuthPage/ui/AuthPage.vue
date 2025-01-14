<template>
  <v-container
    class="fill-height"
    fluid
  >
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        :xs="8"
        :sm="8"
        :md="6"
        :lg="3"
      >
        <v-form @submit.prevent="onSubmitClicked">
          <v-card-text class="mb-0 pb-0">
            <v-text-field
              v-model.trim="login"
              label="Логин"
              tabindex="1"
            />
            <v-text-field
              v-model.trim="password"
              label="Пароль"
              tabindex="2"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
            />
          </v-card-text>
          <v-card-actions class="d-flex flex-column align-start pa-0 ma-0">
            <v-checkbox
              v-model="rememberUser"
              class="ml-1"
              label="Запомнить меня"
              tabindex="3"
            />
            <v-btn
              class="w-50 align-self-center"
              variant="outlined"
              tabindex="4"
              type="submit"
              :disabled="!canSubmit || isLoading">
              Вход
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount } from 'vue';
import { isAxiosError } from 'axios';
import router from '@/router';
import { useLoading } from '@/lib/utils/useLoading';
import { AuthApi } from '@/components/pages/AuthPage/network/AuthApi';
import { ScheduleApi } from '@/components/pages/TimeTable/network/ScheduleApi';
import useUserDataStore from '@/components/pages/MainPage/store/userDataStore';
import { useSnackbarStore } from '@/components/common/ui/widgets/store/SnackbarStore';

/** Экземпляр класса API авторизации ({@link AuthApi}) */
const authApi = new AuthApi('/auth');

/** Экземпляр класса API расписания ({@link ScheduleApi}) */
const scheduleApi = new ScheduleApi('/schedule');

/**
 * Экземпляр класса {@link useUserDataStore}
 * Экземпляр класса {@link useSnackbarStore}
 */
const userDataStore = useUserDataStore();
const snackbarStore = useSnackbarStore();

/** Переменная, хранящая статус получения данных с сервера */
const { isLoading, withLoading } = useLoading();

/** Переменная-логин */
const login = ref<string>('');

/** Переменная-пароль */
const password = ref<string>('');

/** Переменная-флаг показа/скрытия пароля */
const showPassword = ref<boolean>(false);

/** Переменная-флаг сохранения данных пользователя */
const rememberUser = ref<boolean>(false);

/** Computed-свойство, определяющее, валидна ли кнопка, если имеется текст в полях логина и пароля */
const canSubmit = computed(() => login.value && password.value);

/** Очистка localStorage при открытии экрана */
onBeforeMount(() => localStorage.clear());

/** Метод добавления пользователя в расписание */
const callCreateUser = async () => {
  try {
    await scheduleApi.createUser();
  } catch (err) {
    console.error(err);
  }
};

/** Функция обработки нажатия на кнопку авторизации ("Вход") */
const onSubmitClicked = () => withLoading(
  authApi.authorize({
    login: login.value,
    password: password.value,
    rememberMe: rememberUser.value
  })
  .then(async (data) => {
    if (rememberUser.value) {
      userDataStore.saveJwtToken(data.accessToken);
    }

    userDataStore.setJwtToken(data.accessToken);

    await callCreateUser();

    const redirect = router.currentRoute.value.query.redirect;

    router.push(typeof redirect === 'string' ? redirect : '/');
  })
  .catch((e) => {
    if (isAxiosError(e) && e.response?.status === 401) {
      snackbarStore.openSnackbar('Неверный логин или пароль. Повторите попытку.', { icon: 'error' });
    } else {
      snackbarStore.openSnackbar('Ошибка авторизации. Повторите попытку.', { icon: 'error' });
    }
    login.value = '';
    password.value = '';
  })
);
</script>

<style scoped lang="scss">
.v-container {
  min-height: calc(100vh - 96px);
}
</style>
