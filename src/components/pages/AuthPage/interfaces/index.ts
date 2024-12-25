/**
 * Данные, приходящие с сервера при авторизации
 * @property {string} accessToken JWT-токен пользователя
 */
interface SignInResponse {
  accessToken: string;
}

/**
 * Данные, отправляемые на сервер при авторизации
 * @property {string} login логин пользователя
 * @property {string} password пароль
 */
interface SignInRequest {
  login: string;
  password: string;
}
