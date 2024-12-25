import { BaseApi } from '@/components/common/network/base_api/BaseApi';

/**
 * BaseApi-класс для авторизации пользователя
 */
export class AuthApi extends BaseApi {
  /**
   * Функция авторизации. Отправляет POST-запрос по эндпоинту "/some_endpoint", получает ответ и возвращает
   * поле access_token. В случае ошибки выполнения запроса выводит лог ошибки и возвращает null
   * @param {SignInRequest} data объект с полями "login" и "password"
   * @returns {SignInResponse} JWT-токен
   */
  authorize = async (data: SignInRequest): Promise<SignInResponse> => (
    await this.axiosInstance.post(`/profile${this.path}/sign-in`, data)
  ).data;
}