import Menu  from '@/classes/external/Menu'

export default (router, props) => {
  const menu = (new Menu(router)).setRouteProps(props).setBadge('plan');

  return menu.clone().setName('Мои').setIcon('fas fa-user-circle').setChildren([
      menu.clone().setName('Профиль').setRouteName('my-profile').setIcon('fas fa-user').setBadge(null)
    ]).toArray();
}
