import HRoute from '@/classes/external/HRoute'
// Views
/**
 * @param {String} code
 * @param {String} labelNominativus
 * @param {String} labelGenitivus
 * @return {{items: *}}
 */
export default function (code, labelNominativus, labelGenitivus) {
  const UserList = () => import ("~views/pages/director/user/list");
  const UserCreate = () => import ( "~views/pages/director/user/create");
  const UserUpdate = () => import ( "~views/pages/director/user/update");
  const UserUpdateSL = () => import ( "~views/pages/stream_leader/user/update");

  const StreamList = () => import ("~views/pages/stream_leader/stream/list");
  const StreamListUser = () => import ("~views/pages/stream_leader/stream/userList");
  const Dashboard = () => import ("~views/pages/stream_leader/dashboard");

  const ReportsTemplateIndex     = () => import ( "~views/pages/stream_leader/reports/templates");
  const ReportsVacationPlanIndex = () => import ( "~views/pages/stream_leader/reports/vacation_plan/index");
  const ReportsVacationPlanForm = () => import ( "~views/pages/stream_leader/reports/vacation_plan/form");




  const routeClass = new HRoute();
  const main = routeClass.clone()
    .setName(code)
    .setLabel(labelNominativus)
    .setRole(code)
    .setPath('/in/:organizationId/' + code);

  return main.setChildren((route) => [
    route.clone().setName('dashboard').setPath('dashboard').setLabel('Панель ' + labelGenitivus.toLowerCase()).setComponent(Dashboard),
    route.clone().setRoute('stream').setLabel('Потоки').setThroughComponent().setChildren((route) => [
      route.clone().setName('list').setComponent(StreamList),
      route.clone().setName('user').setPath(':learningStreamId/user').setComponent(StreamListUser),
      route.clone().setName('user-create').setPath(':learningStreamId/user/create').setLabel('Создание').setComponent(UserCreate),
      route.clone().setName('user-update').setPath(':learningStreamId/user/update/:id').setLabel('Редактирование').setComponent(UserUpdate),
      route.clone().setName('user-update-sl').setPath(':learningStreamId/user/update/sl/:id').setLabel('Редактирование').setComponent(UserUpdateSL),
    ]),
    route.clone().setRoute('user').setLabel('Пользователи').setThroughComponent().setChildren((route) => [
      route.clone().setName('list').setComponent(UserList),
      route.clone().setName('create').setPath('create').setLabel('Создание').setComponent(UserCreate),
      route.clone().setName('update').setPath('update/:id').setLabel('Редактирование').setComponent(UserUpdate),
    ]),
    route.clone().setRoute('report').setThroughComponent().setChildren((route) => [
      route.clone().setRoute('vacation-plan').setThroughComponent().setChildren((route) => [
        route.clone().setRoute('index').setLabel('План на каникулы').setComponent(ReportsVacationPlanIndex),
        route.clone().setRoute('create').setLabel('Добавление отчёта').setComponent(ReportsVacationPlanForm),
        route.clone().setName('update').setPath('update/:id').setLabel('Радектирование отчёта').setComponent(ReportsVacationPlanForm)
      ]),
      route.clone().setRoute('templates').setLabel('Шаблоны').setComponent(ReportsTemplateIndex),


    ]),
  ]).toArray()
}
