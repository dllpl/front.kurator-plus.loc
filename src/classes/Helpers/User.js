class UserHelper {
  fio(user) {
    return this._fioArray(user).join(' ')
  }

  fioShort(user) {
    return this._fioArrayShort(user).join(' ')
  }

  fioLite(user) {
    return this._fioArrayLite(user).join(' ')
  }

  _fioArray(user) {
    return [user.surname, user.name, user.patronymic].filter(value => value);
  }

  _fioArrayShort(user) {
    return [user.surname, user.name, user.patronymic ? user.patronymic.charAt(0) + '.' : null].filter(value => value);
  }

  _fioArrayLite(user) {
    return [user.surname, user.name ? user.name.charAt(0) + '.' : null, user.patronymic ? user.patronymic.charAt(0) + '.' : null].filter(value => value);
  }
}

export default new UserHelper();
