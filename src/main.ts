import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './vuex/store';
import firebase from 'firebase';
import './registerServiceWorker';

import config from '@/firebase.ts';

Vue.config.productionTip = false;

firebase.initializeApp(config);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
