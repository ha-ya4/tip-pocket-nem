import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './vuex/store';
import firebase from 'firebase';
import Vuetify from 'vuetify'
import './registerServiceWorker';

import config from '@/firebase.ts';

Vue.use(Vuetify, {})

Vue.config.productionTip = false;

firebase.initializeApp(config);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
