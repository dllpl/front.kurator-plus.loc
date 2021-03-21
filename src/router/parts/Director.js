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
  const UserDestroy = () => import ( "~views/pages/director/user/destroy");
  const UserRelations = () => import ( "~views/pages/director/user/relations");
  const StreamList = () => import ("~views/pages/director/stream/list");
  const StreamListUser = () => import ("~views/pages/director/stream/userList");
  const Dashboard = () => import ("~views/pages/director/dashboard");

  const ReportsTemplateIndex     = () => import ( "~views/pages/director/reports/templates");
  const ReportsVacationPlanIndex = () => import ( "~views/pages/director/reports/vacation_plan/index");
  const ReportsVacationPlanForm = () => import ( "~views/pages/director/reports/vacation_plan/form");

  const ReportsVacanciesIndex = () => import("~views/pages/stream_leader/reports/vacancies/index");
  const ReportsVacanciesForm = () => import("~views/pages/stream_leader/reports/vacancies/form");

  const routeClass = new HRoute();
  const main = routeClass.clone()
    .setName(code)
    .setLabel(labelNominativus)
    .setRole(code)
    .setPath('/in/:organizationId/'+code);

  return main.setChildren((route) => [
    route.clone().setName('dashboard').setPath('dashboard').setLabel('Панель ' + labelGenitivus.toLowerCase()).setComponent(Dashboard),
    route.clone().setRoute('user').setLabel('Пользователи').setThroughComponent().setChildren((route) => [
      route.clone().setName('list').setComponent(UserList),
      route.clone().setName('create').setPath('create').setLabel('Создание').setComponent(UserCreate),
      route.clone().setName('update').setPath('update/:id').setLabel('Редактирование').setComponent(UserUpdate),
      route.clone().setName('destroy').setPath('destroy/:id').setLabel('Удаление').setComponent(UserDestroy),
      route.clone().setName('relations').setPath('relations/:id').setLabel('Связи').setComponent(UserRelations),
    ]),
    route.clone().setRoute('report').setThroughComponent().setChildren((route) => [
      route.clone().setRoute('vacation-plan').setThroughComponent().setChildren((route) => [
        route.clone().setRoute('index').setLabel('План на каникулы').setComponent(ReportsVacationPlanIndex),
        route.clone().setRoute('create').setLabel('Добавление отчёта').setComponent(ReportsVacationPlanForm),
        route.clone().setName('update').setPath('update/:id').setLabel('Радектирование отчёта').setComponent(ReportsVacationPlanForm)
      ]),
      route.clone().setRoute('templates').setLabel('Шаблоны').setComponent(ReportsTemplateIndex),

      route.clone().setRoute('vacancies').setThroughComponent().setChildren((route) => [
        route.clone().setRoute('index').setLabel('Данные по кадрам').setComponent(ReportsVacanciesIndex),
        route.clone().setRoute('create').setLabel('Добавление отчёта').setComponent(ReportsVacanciesForm),
        route.clone().setName('update').setPath('update/:id').setLabel('Радектирование отчёта').setComponent(ReportsVacationPlanForm)
      ]),
    ]),
    route.clone().setRoute('stream').setLabel('Потоки').setThroughComponent().setChildren((route) => [
      route.clone().setName('list').setComponent(StreamList),
      route.clone().setName('user').setPath(':learningStreamId/user').setComponent(StreamListUser),
    ])
  ]).toArray()
}
