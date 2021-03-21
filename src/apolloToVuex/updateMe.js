import QueryMeFull from "~gql/me/queryMeFull.graphql";

const TIMEOUT = 60 * 1000;
/**
 *
 * @param {VueApollo} ApolloClient
 * @param {Vuex.Store} Vuex
 * @param {string} strategy
 *  always - всегда
 *  ifEmpty - только если хранилищше пустое
 *  ifTimeout - по истечении времени
 */
export default function ATVUpdateMe(ApolloClient, Vuex, strategy = 'always') {
  return new Promise((resolve, reject) => {
    if (!ApolloClient) {
      throw new Error('Отсутствует VueApollo');
    }

    if (!Vuex) {
      throw new Error('Отсутствует Vuex');
    }

    const user = Vuex.state.user;
    if (strategy === 'ifEmpty' && user.me.id) {
      resolve();
      return;
    }

    if (strategy === 'ifTimeout' && user.lastUpdate) {
      if ((user.lastUpdate.getTime() + TIMEOUT) > (new Date).getTime()) {
        resolve();
        return;
      }
    }

    ApolloClient.query({
      query: QueryMeFull
    }).then(({errors, data}) => {
      if (!errors) {
        Vuex.commit('user/updateMe', data.me);
        resolve();
      }
      else {
        throw errors;
      }
    });
  });
}
