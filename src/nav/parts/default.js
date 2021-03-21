import Menu  from '@/classes/external/Menu'
import admin from "@/nav/parts/_admin";
import my from "@/nav/parts/_my";

export default (router, props, superuser) => {
  const menu = (new Menu(router)).setRouteProps(props).setBadge('plan');
  return [
    menu.clone().setName('Главная').setRouteName('my-dashboard').setIcon('icon-speedometer').setBadge(null).build(),
  ].concat(superuser?admin(router, props):[]).concat(my(router,props))
}
