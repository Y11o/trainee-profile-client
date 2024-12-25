import { defineStore } from 'pinia';
import { JWT_TOKEN_KEY } from '@/components/common/constants/local_storage_constants';
import { RoleEnum } from '@/components/common/constants/RoleEnum';
import type { IJwtPayload, IRawJwtPayload } from '@/components/common/interfaces/IJwtPayload';

export const useUserDataStore = defineStore('userDataStore', {
  state: () => ({
    /**
     * JWT-токен
     */
    jwtToken: '',
  }),
  getters: {
    /**
     * Геттер - авторизован ли пользователь
     * @returns boolean
     */
    isAuthorized: (state) => !!state.jwtToken,

    /**
     * Геттер JWT-токена пользователя. Возвращает сохраненное в jwtToken значение. Если оно отсутствует,
     * то достает его из localStorage. Если отсутствует и там, то возвращает null
     * @returns JWT-токен в формате string | null
     */
    getJwtToken(): string | null {
      if (this.jwtToken !== '') {
        return this.jwtToken;
      } else {
        const token = this.savedJwtToken;
        if (token) {
          this.jwtToken = token;
        }
        return token;
      }
    },

    /**
     * Парсит JWT-токен и возвращает нужные значения
     * @returns IJwtPayload
     */
    jwtPayload(state): IJwtPayload | null {
      if (!state.jwtToken) {
        return null;
      }

      try {
        const base64 = state.jwtToken.split('.')[1]
          .replace(/-/g, '+')
          .replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16))
            .slice(-2)
          )
          .join('')
        );

        const jwtPayload: IRawJwtPayload = JSON.parse(jsonPayload);

        return {
          exp: jwtPayload.exp,
          userId: jwtPayload.id,
          userLogin: jwtPayload.login,
          userRole: RoleEnum[jwtPayload.authorities[0].authority as keyof typeof RoleEnum] || '',
        };
      } catch (error) {
        throw Error(`Failed parsing JWT: ${error}`);
      }
    },

    /**
     * Геттер сохраненного в localStorage JWT-токена
     * @returns сохраненный JWT-токен в формате string или null
     */
    savedJwtToken(): string | null {
      const token = localStorage.getItem(JWT_TOKEN_KEY);
      return token ? JSON.parse(token) : null;
    },

    /**
     * Геттер ID пользователя
     * @returns ID пользователя
     */
    userID(): number {
      return this.jwtPayload?.userId || NaN;
    },

    /**
     * Геттер роли пользователя
     * @returns RoleEnum
     */
    userRole(): RoleEnum | '' {
      return this.jwtPayload?.userRole || '';
    },

    /**
     * Проверка принадлежности к определенной роли
     */
    roleIs() {
      const userRole = this.userRole as string;

      return {
        isCurator: userRole === RoleEnum.USER_TUTOR,
        isMentor: userRole === RoleEnum.USER_MENTOR,
        isAssistant: userRole === RoleEnum.USER_ASSISTANT,
        isHead: userRole === RoleEnum.USER_HEAD,
      };
    }
  },
  actions: {
    /**
     * Сеттер JWT-токена пользователя
     * @param {string} token JWT-токен пользователя
     */
    setJwtToken(token: string) {
      this.jwtToken = token;
    },

    /**
     * Метод сохранения JWT-токена в localStorage. Также вызывает метод setJwtToken
     * @param {string} token JWT-токен пользователя
     */
    saveJwtToken(token: string) {
      localStorage.setItem(JWT_TOKEN_KEY, JSON.stringify(token));
      this.setJwtToken(token);
    },
  }
});

export default useUserDataStore;
