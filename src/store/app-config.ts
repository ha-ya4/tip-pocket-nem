import {
  UPDATE_SEND_BUTTON,
  UPDATE_CONFIG_DATA,
} from '@/store/mutation-types.ts';
import { ConfigData } from '@/types/data-class.ts';



export default {
  namespaced: true,

  state: {
    amount: [
      { value: 0, defaultValue: false }, // valueの書き換え不可
      { value: 1.0, defaultValue: true },
      { value: 5.0, defaultValue: false },
      { value: 10.0, defaultValue: false },
    ],

    message: [
      { value: '', defaultValue: false }, // 書き換え不可
      { value: 'hello', defaultValue: true },
      { value: 'world', defaultValue: false },
      { value: 'hello world', defaultValue: false },
    ],

    // 送金buttonを押してから送金するかどうか
    sendButton: true,

    amountLimit: 100,
  },

  getters: {
    defaultAmount(state: any): number {
      return state.amount.find(
        (item: { value: number, defaultValue: boolean }) => item.defaultValue === true,
      ).value;
    },

    defaultMessage(state: any): string {
      return state.message.find(
        (item: { value: string, defaultValue: boolean }) => item.defaultValue === true,
      ).value;
    },
  },

  mutations: {
    // sendButtonをtrueならfalse、またはその逆に書き換える
    [UPDATE_SEND_BUTTON](state: any) {
      if (state.sendButton === true) {
        state.sendButton = false;
      } else {
        state.sendButton = true;
      }
    },

    // 新たな設定を受け取ってstateを更新する
    [UPDATE_CONFIG_DATA](state: any, configData: ConfigData) {
      state.amount = configData.amount;
      state.message = configData.message;
      state.sendButton = configData.sendButton;
      state.amountLimit = configData.amountLimit;
    },
  },

  actions: {},
};
