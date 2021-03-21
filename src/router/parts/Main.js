import Vue          from 'vue'
import Router       from 'vue-router'
import HRoute       from '@/classes/external/HRoute'
import Director     from '@/router/parts/Director';
import StreamLeader from '@/router/parts/StreamLeader';
import Admin        from '@/router/parts/Admin';
import Roles        from '@/enums/roles';
// import Secretary    from "@/router/parts/Secretary";
// import StreamLeader from "@/router/parts/StreamLeader";

Vue.use(Router);

// Views
const MyDashboard              = () => import ( "~views/pages/my/dashboard");
const MyProfile                = () => import ( "~views/pages/my/profile");
const MyProfilePassword        = () => import ( "~views/pages/my/profilePassword");



// Containers
const DefaultContainer = () => import('@/containers/DefaultContainer');

const routeClass = new HRoute().setLabel('my');

let routes = routeClass.clone().setPath('/my').setName('my').setThroughComponent().setChildren((route) => [
  route.clone().setRoute('dashboard').setLabel('Личная панель').setComponent(MyDashboard),
  route.clone().setRoute('profile').setLabel('Профиль').setComponent(MyProfile),
  route.clone().setRoute('profile-password').setLabel('Профиль - Пароль').setComponent(MyProfilePassword),
]).toArray().concat(Admin.items);

const directorRoles = new Roles().getSelectOptionsByTagsAll(['directorRoute'], (elements) => elements);

for (let key in directorRoles) {
  if (directorRoles.hasOwnProperty(key)) {
    routes = routes.concat(Director(key, directorRoles[key].title, directorRoles[key].title2));
  }
}

const streamLeaderRoles = new Roles().getSelectOptionsByTagsAll(['streamLeaderRoute'], (elements) => elements);

for (let key in streamLeaderRoles) {
  if (streamLeaderRoles.hasOwnProperty(key)) {
    routes = routes.concat(StreamLeader(key, streamLeaderRoles[key].title, streamLeaderRoles[key].title2));
  }
}

export default {
  items: [
    {
      path: '/oauth/callback',
      meta: {
        guest: true
      }
    },
    {
      path: '/',
      redirect: '/my/dashboard',
      name: 'home',
      component: DefaultContainer,
      children: routes
    }
  ]
};
