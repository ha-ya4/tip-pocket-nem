import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import firebase from 'firebase';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import './registerServiceWorker';

import config from '@/firebase.ts';

Vue.use(Vuetify);

Vue.config.productionTip = false;

firebase.initializeApp(config);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');


/*
1.vuetifyいらない？
*/
