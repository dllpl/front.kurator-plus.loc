import auth from "./auth";
import axios from "axios";

class GraphQL {
  constructor(noredirect = false, token = auth.getToken()) {
    this._token = token;
    this._noredirect = noredirect;
  }

  set token(value) {
    this._token = value;
  }

  set noredirect(value) {
    this._noredirect = value;
  }

  /**
   * @return {string}
   */
  getUrl() {
    return process.env.VUE_APP_GRAPHQL_ENDPOINT;
  }

  /**
   *
   * @param response
   * @return {null|Array}
   */
  getErrors(response) {
    if (response.data.errors !== undefined) {
      return response.data.errors;
    }
    return null;
  }

  /**
   *
   * @param response
   * @return {null|Object}
   */
  getData(response) {
    if (response.data.data !== undefined) {
      return response.data.data;
    }
    throw new Error('Undefined Error');
  }

  /**
   *
   * @param errors
   * @return {boolean}
   */
  isAuthError(errors) {
    if (!errors[0]) return false;
    if (!errors[0].extensions && typeof errors[0].extensions !== 'object') {
      console.warn('Undefined errors[0].extensions');
      return false;
    }
    if (errors[0].extensions.category === 'auth') return true;
  }

  /**
   *
   * @param url
   * @param data
   * @param options
   * @return {Promise<{data: (*|undefined)}>}
   */
  sendSync(url, data, options) {
    let thisClass = this;
    return axios.post(url, data, options).then((response) => {

      const errors = thisClass.getErrors(response);

      if (errors) {
        if (!thisClass._noredirect && thisClass.isAuthError(errors)) {
          auth.logout();
        }
        return Promise.reject({errors: errors});
      }

      return {data: thisClass.getData(response)};
    }).catch((err) => {
      return Promise.reject({errors: [{message: err.response}]});
    });
  }

  /**
   * @param graphQLRequest
   * @param url
   * @param options
   * @param noredirect
   * @param token
   * @return {Promise<{errors}|{data}|undefined>}
   */
  requestRawSync(graphQLRequest, url = null, options = {}, noredirect = false, token = auth.getToken()) {
    if (!url) {
      url = this.getUrl()
    }

    if (token) {
      options = Object.assign(options, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
    }

    const data = {};
    data['query'] = graphQLRequest;

    return this.sendSync(url, data, options);
  }

  /**
   * @param type
   * @param graphQLRequest
   * @param url
   * @param options
   * @param noredirect
   * @param token
   * @return {Promise<{errors}|{data}|undefined>}
   */
  requestSync(type, graphQLRequest, url = null, options = {}, noredirect = false, token = auth.getToken()) {
    if (!url) {
      url = this.getUrl()
    }

    if (token) {
      options = Object.assign(options, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
    }
    const data = {};
    data['query'] = type + ' ' + graphQLRequest;

    return this.send(url, data, options);
  }

  async send(url, data, options) {
    let apiRes = null;
    try {
      apiRes = await axios.post(url, data, options);
      const errors = this.getErrors(apiRes);

      if (errors) {
        if (!this._noredirect && this.isAuthError(errors)) {
          auth.logout();
        }
        return {errors: errors}
      }
      return {data: this.getData(apiRes)};
    } catch (err) {
      return {errors: [{message: err.response}]}
    }
  }

  async requestRaw(graphQLRequest, url = null, options = {}, noredirect = false, token = auth.getToken()) {
    if (!url) {
      url = this.getUrl()
    }

    if (token) {
      options = Object.assign(options, {
        headers: {
          Authorization: "Bearer " + token
        }
      })
    }

    const data = {};
    data['query'] = graphQLRequest;

    return await this.send(url, data, options);
  }

  async request(type, graphQLRequest, url, options = {}) {
    if (!url) {
      url = this.getUrl()
    }

    if (this._token) {
      options = Object.assign(options, {
        headers: {
          Authorization: "Bearer " + this._token
        }
      })
    }
    const data = {};
    data['query'] = type + ' ' + graphQLRequest;

    return await this.send(url, data, options);
  }

  async query(graphQLRequest, url, options = {}) {
    return this.request('query', graphQLRequest, url, options)
  }

  async mutation(graphQLRequest, url, options = {}) {
    return this.request('mutation', graphQLRequest, url, options)
  }
}

export default GraphQL;
