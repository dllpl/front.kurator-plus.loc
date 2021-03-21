'use strict';
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import './polyfill'
// import cssVars from 'css-vars-ponyfill'
import Vue from 'vue'

import './initers/notify'

import BootstrapVue from 'bootstrap-vue'
import App from './App'
import router from './router/index'

import './initers/highlight'
import './initers/multiselect'
import apolloProvider from'./initers/apollo'

import store from './store'

Vue.use(BootstrapVue);
/* eslint-disable no-new */

// region autocomplete
import Autocomplete from 'v-autocomplete'
// You need a specific loader for CSS files like https://github.com/webpack/css-loader
import 'v-autocomplete/dist/v-autocomplete.css'

Vue.use(Autocomplete);
// endregion

// region mask
import VueTheMask from 'vue-the-mask'
Vue.use(VueTheMask);
// endregion

// region ckeditor
import CKEditor from '@ckeditor/ckeditor5-vue';
Vue.use( CKEditor );
// endregion

// region moment
const moment = require('moment');
require('moment/locale/ru');
Vue.use(require('vue-moment'), {
  moment
});
// endregion

// region Vuelidate
import Vuelidate from 'vuelidate'
Vue.use(Vuelidate);
// endregion

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  apolloProvider,
  store,
  components: {
    App
  }
});
