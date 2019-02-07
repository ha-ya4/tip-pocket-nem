interface PayLoad {
  position: string;
  value: string;
}

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
    changeSendButton(state: any) {
      if (state.sendButton === true) {
        state.sendButton = false;
      } else {
        state.sendButton = true;
      }
    },

    // 指定したkey名の値を書き換える
    // 連想配列の型はインターフェースで定義してあるがこれでいいのか？
    registerAmount(state: any, payload: PayLoad) {
      state.amount[payload.position] = payload.value;
    },

    // 指定したkey名のメッセージを書き換える
    registerMessage(state: any, payload: PayLoad) {
      state.message[payload.position] = payload.value;
    },
  },

  actions: {},
};
