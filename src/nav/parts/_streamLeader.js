import Menu  from '@/classes/external/Menu'
import my    from '../parts/_my'
import Roles from "@/enums/roles";

export default (code, router, props) => {
  const menu = (new Menu(router)).setRouteProps(props);
  let role   = new Roles().getObjectByKey(code);
  if (!role) return [];

  return [
    menu.clone().setName('Домой').setRouteName('my-dashboard').setIcon('icon-home').setBadge(null).build(),
    menu.clone()
      .setName('Главная')
      .setRouteName(code + '-dashboard')
      .setIcon('icon-speedometer')
      .setBadge(null)
      .build(),
  ].concat([
    menu.clone().setName(role.titleMenu).setChildren([
      menu.clone().setName('Пользователи').setRoute(code + '-user-list', props).setIcon('fas fa-users'),
      menu.clone().setName('Классы').setRoute(code + '-stream-list', props).setIcon('fas fa-chalkboard-teacher'),
      menu.clone().setName('Шаблоны').setRouteName(code + '-report-templates').setIcon('fas fa-user').setBadge(null),
    ]).build()
  ]).concat(my(router, props));
}
