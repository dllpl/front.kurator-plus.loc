// Views
const OrganizationsList = () => import ("~views/pages/admin/organization/list");
const OrganizationsCreate = () => import ( "~views/pages/admin/organization/create");
const OrganizationsUpdate = () => import ( "~views/pages/admin/organization/update");
const OrganizationsDestroy = () => import ("~views/pages/admin/organization/destroy");
const OrganizationsRelations = () => import ( "~views/pages/admin/organization/relations");
const UserList = () => import ("~views/pages/admin/user/list");
const UserCreate = () => import ( "~views/pages/admin/user/create");
const UserUpdate = () => import ( "~views/pages/admin/user/update");
const UserDestroy = () => import ( "~views/pages/admin/user/destroy");
const UserRelations = () => import ( "~views/pages/admin/user/relations");
const CheckUrl = () => import ("~views/pages/admin/CheckUrl");

import HRoute from '@/classes/external/HRoute'

const routeClass = new HRoute().setLabel('Админ.').setRole('admin');

export default {
  items: [
    routeClass.clone().setName('admin-checkUrl').setPath('/admin/checkUrl').setLabel('Проверка GraphQL').setComponent(CheckUrl).build(),
    routeClass.clone().setName('admin-dashboard').setPath('/admin/dashboard').setLabel('Панель администратора').setComponent(CheckUrl).build(),
    routeClass.clone().setName('admin-organization').setPath('/admin/organization').setLabel('Учреждения').setThroughComponent().setChildren((route) => [
        route.clone().setName('list').setComponent(OrganizationsList),
        route.clone().setName('create').setPath('create').setLabel('Создание').setComponent(OrganizationsCreate),
        route.clone().setName('update').setPath('update/:id').setLabel('Редактирование').setComponent(OrganizationsUpdate),
        route.clone().setName('destroy').setPath('destroy/:id').setLabel('Удаление').setComponent(OrganizationsDestroy),
        route.clone().setName('users').setPath('users/:id').setLabel('Пользователи').setComponent(OrganizationsRelations),
      ]
    ).build(),
    routeClass.clone().setName('admin-user').setPath('/admin/user').setLabel('Пользователи').setThroughComponent().setChildren((route) => [
      route.clone().setName('list').setComponent(UserList),
      route.clone().setName('create').setPath('create').setLabel('Создание').setComponent(UserCreate),
      route.clone().setName('update').setPath('update/:id').setLabel('Редактирование').setComponent(UserUpdate),
      route.clone().setName('destroy').setPath('destroy/:id').setLabel('Удаление').setComponent(UserDestroy),
      route.clone().setName('relations').setPath('relations/:id').setLabel('Организации').setComponent(UserRelations),
    ]).build()
  ]
};
