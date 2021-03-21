import InheritancePolitic from "@/classes/InheritancePolitic";

export default class Menu extends InheritancePolitic {
  /**
   *
   * @param router {VueRouter}
   * @param obj {?object}
   */
  constructor(router, obj) {
    super();
    /**
     *
     * @type {VueRouter}
     * @private
     */
    this._router = router;
    /**
     *
     * @type {?string}
     * @private
     */
    this._url = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._icon = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._badge = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._children = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._name = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._routeName = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._routeProps = null;

    /**
     *
     * @type {{work: {variant: string, text: string}, plan: {variant: string, text: string}}}
     * @private
     */
    this._badgeVariants = {
      plan: {
        variant: 'info',
        text: 'P'
      },
      work: {
        variant: 'warning',
        text: 'D'
      }
    };

    if (!obj) {
      return;
    }

    for (let objItem in obj) {
      if (obj.hasOwnProperty(objItem)) {
        this[objItem] = obj[objItem];
      }
    }
  }

  /**
   *
   * @return {?string}
   */
  getUrl() {
    return this._url;
  }

  /**
   *
   * @return {?string}
   */
  getIcon() {
    return this._icon;
  }

  /**
   *
   * @return {?string}
   */
  getBadge() {
    return this._badge;
  }

  /**
   *
   * @return {?string}
   */
  getName() {
    return this._name;
  }

  /**
   *
   * @return {?string}
   */
  getRouteName() {
    return this._routeName;
  }

  /**
   *
   * @return {?string}
   */
  getRouteProps() {
    return this._routeProps;
  }

  /**
   *
   * @return {{work: {variant: string, text: string}, plan: {variant: string, text: string}}}
   */
  getBadgeVariants() {
    return this._badgeVariants;
  }

  /**
   *
   * @return {Menu}
   */
  clone() {
    return new Menu(this._router, this);
  }

  /**
   *
   * @param min {integer}
   * @param max {integer}
   * @return {number}
   */
  makeRandomInteger(min, max) {
    // получить случайное число от (min-0.5) до (max+0.5)
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  /**
   *
   * @param value {?string}
   * @return {Menu}
   */
  setUrl(value) {
    this._url = value;

    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {Menu}
   */
  setIcon(value) {
    this._icon = value;
    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {Menu}
   */
  setBadge(value) {
    this._badge = value;
    return this;
  }

  /**
   * Вызываемавя функция порождает класс, который наследует свойства
   * @callback childrenMenu
   * @param route {menu}
   * @return {Array<menu>}
   */
  /**
   *
   * @param value {?Array<Menu|childrenRoute|null>}
   * @return {Menu}
   */
  setChildren(value) {
    if ((typeof value) === 'function') {
      let route = this.clone()
        .setRouteName(null)
        .setChildren(null);
      this._children = value(route);
    } else {
      this._children = value;
    }
    return this;
  }


  /**
   *
   * @param value {?string}
   * @return {Menu}
   */
  setName(value) {
    this._name = value;
    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {Menu}
   */
  setRouteName(value) {
    this._routeName = value;

    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {Menu}
   */
  setRouteProps(value) {
    this._routeProps = value;

    return this;
  }

  /**
   *
   * @param name {string}
   * @param props {?object}
   * @return {Menu}
   */
  setRoute(name, props) {
    this._routeName = name;
    this._routeProps = props;

    return this;
  }

  /**
   *
   * @return {string}
   */
  getFullUrl() {
    let path = '';
    if (this._routeName) {
      path = this._router.resolve({name: this._routeName, params: this._routeProps}).route.fullPath;
    } else {
      path = this._url ? this._url : '#';
    }
    if (path === '#') {
      path = '/';
    }
    return path;
  }

  /**
   *
   * @return {{badge: {(string|null)}, children: null, name: {(string|null)}, icon: {(string|null)}, url: {(string|null)}}}
   */
  build() {
    return {
      name: this._name ? this._name : null,
      url: this.getFullUrl(),
      icon: this._icon ? this._icon : null,
      badge: this._badge ? (this._badgeVariants[this._badge]) : null,
      children: this.helperGenFromArray(this.getChildren())
    };
  }

  /**
   * @param name
   * @param url
   * @return {Menu}
   */
  emptyMenu(name, url) {
    this.setName(name).setUrl(url ? url : this.makeRandomUrl()).setIcon(null);
    return this;
  }


  /**
   *
   * @return {Array<Menu|object>}
   */
  getChildren() {
    return this._children ? this._children : [];
  }

  /**
   *
   * @return {string}
   */
  makeRandomUrl() {
    return '#' + this.makeRandomInteger(0, 9999);
  }

  childsToArray() {
    return this.helperGenFromArray(this.getChildren())
  }
}
