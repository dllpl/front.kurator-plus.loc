import InheritancePolitic from "@/classes/InheritancePolitic";

const ComingSoon = () => import("~views/globality/comingSoon");

/**
 * Функция, принимающая значения для наследования
 * @callback InheritancePoliticCallbackHRoute
 * @param childs {Array<HRoute>}
 * @param parent {HRoute}
 */

export default class HRoute extends InheritancePolitic {
  constructor(obj) {
    super();
    /**
     *
     * @type {?string}
     * @private
     */
    this._path = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._namePrefix = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._name = null;
    /**
     *
     * @type {?object}
     * @private
     */
    this._component = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._label = null;
    /**
     *
     * @type {?string}
     * @private
     */
    this._role = null;
    /**
     *
     * @type {Array<HRoute>|object}
     * @private
     */
    this._children = null;

    /**
     * @type {?boolean}
     * @private
     */
    this._props = null;

    /**
     *
     * @type {?string}
     * @private
     */
    this._redirect = null;

    if (!obj) {
      return;
    }

    for (let objItem in obj) {
      if (obj.hasOwnProperty(objItem)) {
        this[objItem] = obj[objItem];
      }
    }

    /**
     *
     * @type {?string}
     * @private
     */
    this._routeProps = null;
    this._obj = obj;
  }

  /**
   *
   * @return {HRoute}
   */
  clone(opts = {}) {
    return new HRoute(Object.assign(this, opts));
  }

  /**
   *
   * @param value {?string}
   * @return {HRoute}
   */
  setNamePrefix(value) {
    this._namePrefix = value;
    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {HRoute}
   */
  setPath(value) {
    this._path = value;
    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {HRoute}
   */
  setPathPrefix(value) {
    this._pathPrefix = value;
    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {HRoute}
   */
  setName(value) {
    this._name = value;
    return this;
  }

  /**
   * Заполняет одинаково Name и Path
   * @param value {string}
   * @return {HRoute}
   */
  setRoute(value) {
    this.setName(value);
    this.setPath(value);
    return this;
  }

  /**
   *
   * @param value {?object}
   * @return {HRoute}
   */
  setComponent(value) {
    this._component = value;
    return this;
  }

  /**
   *
   * @return {HRoute}
   */
  setThroughComponent() {
    this._component = {
      template: `<router-view></router-view>`
      // render(c) {
      //   return c('router-view')
      // }
    };
    return this;
  }

  /**
   *
   * @return {HRoute}
   */
  setComingSoonComponent() {
    this._component = ComingSoon;
    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {HRoute}
   */
  setLabel(value) {
    this._label = value;
    return this;
  }

  /**
   *
   * @param value {?string}
   * @return {HRoute}
   */
  setRole(value) {
    this._role = value;
    return this;
  }

  /**
   * Вызываемавя функция порождает класс, который наследует свойства
   * @callback childrenRoute
   * @param route {HRoute}
   * @return {Array<HRoute>}
   */
  /**
   *
   * @param value {?Array<HRoute|childrenRoute|null>}
   * @return {HRoute}
   */
  setChildren(value) {
    if ((typeof value) === 'function') {
      let route = this.clone()
        .setNamePrefix(this.makeFullName())
        .setName(null)
        .setPathPrefix(this.makeFullPath())
        .setPath(null)
        .setRedirectUrl(null)
        .setChildren(null);
      this._children = value(route);
    } else {
      this._children = value;
    }
    return this;
  }

  /**
   *
   * @param value {?boolean}
   * @return {HRoute}
   */
  setProps(value) {
    this._props = value;
    return this;
  }

  /**
   *
   * @return {string}
   */
  makeFullPath() {
    let path = this._path ? this._path : '';
    let pathPrefix = this._pathPrefix ? this._pathPrefix : '';
    return [pathPrefix, path].filter(val => val).join('/');
  }

  /**
   * @return {string}
   */
  makeFullName() {
    if (!this._name) {
      return '';
    }
    let name = this._name ? this._name : '';
    let namePrefix = this._namePrefix ? this._namePrefix : '';
    return [namePrefix, name].filter(val => val).join('-');
  }

  /**
   *
   * @return {{path: string, component: ?object, children: Array<HRoute|object>, meta: {label: ?string, role: ?string}, name: string, props: object}}
   */
  build() {
    return {
      path: this.makeFullPath(),
      name: this.makeFullName(),
      component: this.getComponent(),
      children: this.helperGenFromArray(this.getChildren()),
      props: this.makeMagickProps(),
      meta: {
        label: this.getLabel(),
        role: this.getRole()
      },
      redirect: this.getRedirect()
    };
  }

  /**
   *
   * @return {?string}
   */
  getNamePrefix() {
    return this._namePrefix;
  }

  /**
   *
   * @return {?string}
   */
  getPath() {
    return this._path;
  }

  /**
   *
   * @return {?string}
   */
  getPathPrefix() {
    return this._pathPrefix;
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
   * @return {?object}
   */
  getComponent() {
    if (!this._component) {
      this.setThroughComponent();
    }
    return this._component;
  }

  /**
   *
   * @return {?string}
   */
  getLabel() {
    return this._label;
  }

  /**
   *
   * @return {?string}
   */
  getRole() {
    return this._role;
  }

  /**
   *
   * @return {Array<HRoute|object>}
   */
  getChildren() {
    return this._children ? this._children : [];
  }

  /**
   *
   * @return {?boolean}
   */
  getProps() {
    return this._props;
  }

  /**
   *
   * @return {boolean}
   */
  makeMagickProps() {
    if (this._props !== null) {
      return this._props;
    }
    let fullPath = this.makeFullPath();
    return (fullPath.indexOf('/:') >= 0);
  }

  /**
   *
   * @param childs {Array<HRoute>}
   * @param parent {HRoute}
   * @return {*[]}
   */
  getDefaultInheritancePolitic(childs, parent) {
    if (!parent || !parent) {
      return childs;
    }
    return childs.map((child) => {
      child.setNamePrefix(parent.makeFullName());
      child.setPathPrefix(parent.makeFullPath());
      return child;
    });
  }


  childsToArray() {
    return this.helperGenFromArray(this.getChildren())
  }


  /**
   *
   * @param {?string} url
   * @return {Menu}
   */
  setRedirectUrl(url) {
    this._redirect = url;
    return this;
  }

  /**
   *
   * @return {?string}
   */
  getRedirect() {
    return this._redirect;
  }
}
