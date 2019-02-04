import Vue from 'vue';
import Vuex from 'vuex';

import appConfig from '@/store/app-config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},

  mutations: {},

  actions: {},

  modules: {
    appConfig,
  }
});
