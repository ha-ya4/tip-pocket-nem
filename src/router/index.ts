import Vue from 'vue';
import Router from 'vue-router';

import Config from '@/views/Config.vue';
import TransactionHistory from '@/views/TransactionHistory.vue';
import Transfer from '@/views/transfer/Transfer.vue';
import Receive from '@/views/Receive.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/transfer',
      name: 'transfer',
      component: Transfer,
    },
    {
      path: '/config',
      name: 'config',
      component: Config,
    },
    {
      path: '/history',
      name: 'history',
      component: TransactionHistory,
    },
    {
      path: '/receive',
      name: 'receive',
      component: Receive,
    },
    {
      path: '*',
      redirect: 'transfer',
    },
  ],
});
