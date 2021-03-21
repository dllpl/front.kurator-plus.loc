import Vue  from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default {
  namespaced: true,
  root: true,
  state() {
    return {
      meLastUpdate: null,
      me: {
        id: null,
        email: null,
        name: null,
        surname: null,
        patronymic: null,
        phone: null,
        superuser: false,
        fillFactor: null,
        relatedOrganizations: [{
          id: null,
          organization: {
            id: null,
            name: null,
            shortName: null,
            slug: null,
          },
          relationship: {
            name: null,
            slug: null,
          }
        }]
      }
    }
  },
  getters: {},
  mutations: {
    updateMe(state, opts) {
      state.me = Object.assign({...state.me, ...opts});
      state.lastUpdate = new Date;
    }
  },
};
