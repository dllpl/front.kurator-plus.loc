import Menu from '@/classes/external/Menu'

export default (router, props) => {
  const menu = (new Menu(router)).setRouteProps(props);
  return menu.clone().setName('Администратор').setIcon('font-weight-bold fas fa-jedi').setChildren((route) => [
      // route.clone().setName('Проверка GraphQL').setUrl('/admin/checkURL').setIcon('fas fa-bug').setBadge(null),
      route.clone().setName('Организации').setRouteName('admin-organization-list').setIcon('fas fa-building'),
      route.clone().setName('Пользователи').setRouteName('admin-user-list').setIcon('fas fa-users'),
    ]).toArray()
}
