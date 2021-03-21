import {ApolloClient}     from 'apollo-client'
// import {HttpLink}    from 'apollo-link-batch-http'
import {HttpLink}         from 'apollo-link-http'
import {InMemoryCache}    from 'apollo-cache-inmemory'
import {onError}          from 'apollo-link-error';
import Vue                from 'vue';
import VueApollo          from 'vue-apollo'
import {ApolloLink, from} from "apollo-link";
import auth               from "../plugin/auth";
import miniToastr         from "mini-toastr";

// Cache implementation
const cache = new InMemoryCache();

// HTTP connection to the API
const httpLink = new HttpLink({
  uri: process.env.VUE_APP_GRAPHQL_ENDPOINT,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem('jwt');
  operation.setContext(({headers = {}}) => ({
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }));

  return forward(operation);
});

/**
 * @param messageError
 * @return {boolean}
 */
function isAuthError(messageError) {
  try {
    if (messageError.extensions.category === 'auth') {
      return true;
    }
  } catch (e) {

  }
  return false;
}

function isNoRedirect({variables}) {
  if (variables._noredirect !== undefined) {
    return variables._noredirect;
  }
  return false
}

const errorLink = onError(({graphQLErrors, networkError, operation}) => {
  if (graphQLErrors) {
    graphQLErrors.map((message) => {
      if (isAuthError(message) && !isNoRedirect(operation)) {
        localStorage.removeItem('authToken');
        window.location = auth.logout();
        return null;
      }else{
        if(!operation.variables || !operation.variables._hideErrors){
          let errMessage = message.message;
          if(errMessage === 'Unique violation'){
            errMessage = 'Не удалось сохранить. Запись не уникальна.'
          }
          miniToastr['error'](errMessage, 'graphQL error', 60000,null,);
        }
      }
    });
  }
});

const defaultOptions = {
  watchQuery: {
    errorPolicy: 'ignore',
    fetchPolicy: 'no-cache'
  },
  query: {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  },
  mutate: {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  }
};

// Create the apollo client
const apolloClient = new ApolloClient({
  link: from([authMiddleware, errorLink, httpLink]),
  cache,
  defaultOptions,
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

export {apolloProvider as default}
