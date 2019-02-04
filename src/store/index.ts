import Vue from 'vue';
import Vuex from 'vuex';

import Config from '@/store/app-config';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    Config,
  },
});
