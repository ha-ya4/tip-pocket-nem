export default {
  namespaced: true,

  state: {
    amount: {
      value1: '0',
      value2: '10',
      value3: '100',
    },

    defaultAmount: 'value1',

    message: {
      value1: '',
      value2: '',
      value3: '',
    },

    defaultMessage: 'value1',

    // 送金buttonを押してから送金するかどうか
    sendButton: true,
  },

  getters: {
    defaultAmount(state: any): string {
      // デフォルトに設定しているkey名を取得
      const defaultAmountName = state.defaultAmount;
      // key名でデフオルト値を取得して返す
      return state.amount[defaultAmountName];
    },

    defaultMessage(state: any): string {
      // デフォルトに設定しているkey名を取得
      const defaultMessageName = state.defaultMessage;
       // key名でデフオルトメッセージを取得して返す
      return state.message[defaultMessageName];
    },
  },

  mutations: {
    // sendButtonをtrueならfalse、またはその逆に書き換える
    changesendButton(state: any) {
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

interface PayLoad {
  position: string;
  value: string;
}


