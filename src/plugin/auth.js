const domain = process.env.VUE_APP_AUTH_DOMAIN;
const itemName = 'jwt';

const auth = {
  /**
   * Авторизация
   * @return {string}
   */
  getLoginUrl() {
    return domain + '/login'
  },
  /**
   * Привязка к соц.сетям
   * @return {string}
   */
  getAttachSocialsUrl(provider) {
    return domain + '/login/' + provider;
  },
  /**
   * URL выхода
   * @return {string}
   */
  getLogoutUrl() {
    return domain + '/logout'
  },
  /**
   * Получить токен
   * @return {string}
   */
  getToken() {
    const jwt = localStorage.getItem(itemName);

    if (jwt) {
      return jwt;
    }
    this.getLoginUrl();
  },
  /**
   * Установить токен
   * @param token
   */
  setToken(token) {
    localStorage.setItem(itemName, token);
  },
  /**
   * Переход на страницу входа
   */
  login() {
    window.location = this.getLoginUrl()? this.getLoginUrl():'/';
  },
  logout() {
    localStorage.removeItem(itemName);
    window.location = this.getLogoutUrl();
  }
};

// если 401 страница - выкидывать на авторизацию

export default auth;
