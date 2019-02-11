import {
  CHANGE_SEND_BUTTON,
  REGISTER_DEFAULT_AMOUNT,
  REGISTER_DEFAULT_MESSAGE,
  UPDATE_CONFIG_DATA,
} from '@/store/mutation-types.ts';
import { TypeConfigData } from '@/interface.ts';



export default {
  namespaced: true,

  state: {
    amount: [
      { value: 0, defaultValue: false }, // valueの書き換え不可
      { value: 1, defaultValue: true },
      { value: 5, defaultValue: false },
      { value: 10, defaultValue: false },
    ],

    message: [
      { value: '', defaultValue: false }, // 書き換え不可
      { value: 'hello', defaultValue: false },
      { value: 'world', defaultValue: true },
      { value: 'hello world', defaultValue: false },
    ],

    // 送金buttonを押してから送金するかどうか
    sendButton: true,

    amountLimit: 100,
  },

  mutations: {
    // sendButtonをtrueならfalse、またはその逆に書き換える
    [CHANGE_SEND_BUTTON](state: any) {
      if (state.sendButton === true) {
        state.sendButton = false;
      } else {
        state.sendButton = true;
      }
    },

    // 新たな設定を受け取ってstateを更新する
    [UPDATE_CONFIG_DATA](state: any, configData: TypeConfigData) {
      state.amount = configData.amount;
      state.message = configData.message;
      state.sendButton = configData.sendButton;
      state.amountLimit = configData.amountLimit;
    },
  },

  actions: {},
};
