/**
 * Функция, принимающая значения для наследования
 * @callback InheritancePoliticCallback
 * @param  {Array} childs
 * @param {InheritancePolitic} parent
 */
export default class InheritancePolitic {
  constructor(inheritancePolitic = null, ignoreInheritancePolitic = false) {
    /**
     *
     * @type {boolean}
     * @private
     */
    this._ignoreInheritancePolitic = ignoreInheritancePolitic;
    /**
     *
     * @type {?string}
     * @private
     */
    this._inheritancePolitic = inheritancePolitic;
  }

  /**
   *
   * @return {boolean}
   */
  getIgnoreInheritancePolitic() {
    return this._ignoreInheritancePolitic;
  }

  /**
   *
   * @param value {boolean}
   * @return {Menu}
   */
  setIgnoreInheritancePolitic(value) {
    this._ignoreInheritancePolitic = value;
    return this;
  }

  /**
   *
   * @param closure {CallableFunction}
   * @return {Menu}
   */
  setInheritancePolitic(closure) {
    this._inheritancePolitic = closure;
    return this;
  }

  /**
   *
   * @param childs {Array}
   * @param {?InheritancePolitic} parent
   * @return {Array}
   */
  getDefaultInheritancePolitic(childs, parent = null) {
    return childs;
  }

  /**
   *
   * @return {?getDefaultInheritancePolitic}
   */
  getInheritancePolitic() {
    if (this._ignoreInheritancePolitic === true) {
      return null;
    }
    if (!this._inheritancePolitic) {
      return this.getDefaultInheritancePolitic;
    }
    return this._inheritancePolitic;
  }


  /**
   * Хелпер по генерации конечного массива из массива объектов
   * @param items {?Array<InheritancePolitic>}
   * @return ?Array
   */
  helperGenFromArray(items) {
    if (items === null || items.length === 0) {
      return null;
    }

    return items.map((item) => {
      if (!(item instanceof InheritancePolitic)) return item;
      return item.build();
    });
  }

  /**
   * @return {Array}
   */
  toArray() {
    return [this.build()]
  }

  /**
   * @return {Array}
   */
  childsToArray() {
    return this.helperGenFromArray(this)
  }
}
