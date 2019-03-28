import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueQriously from 'vue-qriously';
import './registerServiceWorker';

import { provide } from '@/provide';

Vue.config.productionTip = false;

Vue.use(VueQriously);

new Vue({
  router,
  store,
  provide,
  render: (h) => h(App),
}).$mount('#app');


/*
２．メッセージのテキストエリアの自動
3.configのsendButtonのところv-for
*/
