import {
  CHANGE_SEND_BUTTON,
  REGISTER_AMOUNT,
  REGISTER_MESSAGE,
  UPDATE_CONFIG_DATA,
} from '@/store/mutation-types.ts';
import { TypeConfigData, RegisterPayLoad } from '@/interface.ts';



export default {
  namespaced: true,

  state: {
    amount: {
      value1: '0',
      value2: '10',
      value3: '100',
    },

    defaultAmount: '0',

    message: {
      value1: '',
      value2: '',
      value3: '',
    },

    defaultMessage: '',

    // 送金buttonを押してから送金するかどうか
    sendButton: true,
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

    // 指定したkey名の値を書き換える
    // 連想配列の型はインターフェースで定義してあるがこれでいいのか？
    [REGISTER_AMOUNT](state: any, Registerpayload: RegisterPayLoad) {
      state.amount[Registerpayload.position] = Registerpayload.value;
    },

    // 指定したkey名のメッセージを書き換える
    [REGISTER_MESSAGE](state: any, Registerpayload: RegisterPayLoad) {
      state.message[Registerpayload.position] = Registerpayload.value;
    },

    // 新たな設定を受け取ってstateを更新する
    [UPDATE_CONFIG_DATA](state: any, configData: TypeConfigData) {
      state.amount = configData.amount;
      state.defaultAmount = configData.defaultAmount;
      state.message = configData.message;
      state.defaultMessage = configData.defaultMessage;
      state.sendButton = configData.sendButton;
    },
  },

  actions: {},
};
