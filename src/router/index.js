import Vue            from 'vue'
import Router         from 'vue-router'
import Vuex           from 'vuex';
import auth           from "../plugin/auth";
import MainRoute      from './parts/Main'
import ATVUpdateMe    from "@/apolloToVuex/updateMe";
import ApolloProvider from "@/initers/apollo";
import Store          from "@/store";
import clearVueEvents from "~classes/clearVueEvents";

Vue.use(Router);

const routes = [].concat(MainRoute.items);

let router = new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'open active',
  scrollBehavior: () => ({y: 0}),
  routes: routes
});

router.beforeEach((to, from, next) => {
  // гостевые URL
  if (to.matched.some(record => record.meta.guest)) {
    // callback URL
    if (to.matched.some(record => record.path === '/oauth/callback')) {
      if (to.query.access_token) {
        auth.setToken(to.query.access_token);
        ATVUpdateMe(ApolloProvider.defaultClient, Store, 'always');
        next({'name':'home'});
      }
      else {
        alert('access_token не найден')
      }
    }
  }
  else if (!auth.getToken()) {
    auth.login();
  }
  else {
    ATVUpdateMe(ApolloProvider.defaultClient, Store, 'ifTimeout').then(() => {
      if (!Vuex) {
        throw new Error('Отсутствует Vuex');
      }
      let role           = to.meta ? to.meta.role : undefined;
      let organizationId = to.params ? to.params.organizationId : undefined;
      let isCorrectRight = false;
      if (!role || !organizationId) {
        isCorrectRight = true;
      }
      else {
        const findRight = (Store.state.user.me.relatedOrganizations.find(relatedOrganization => {
          if (role !== relatedOrganization.relationship.slug) {
            return false;
          }

          if (organizationId !== relatedOrganization.organization.id) {
            return false;
          }

          return true;
        }));
        if (findRight) {
          isCorrectRight = true;
        }
      }

      if (!isCorrectRight) {
        next({'name':'home'});
      }
    });

    // let organization = Vuex.state.user.me.relatedOrganizations.find(organization => organization.id === to.params.organizationId);

  }
  next()
});

export default router;
